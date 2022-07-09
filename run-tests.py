#!/usr/bin/env python

#
# Copyright (2021) The Delta Lake Project Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
import subprocess
import shlex
from os import path


def run_sbt_tests(root_dir, scala_version=None):
    print("##### Running SBT tests #####")
    sbt_path = path.join(root_dir, path.join("build", "sbt"))
    if scala_version is None:
        run_cmd([sbt_path, "clean", "+test"], stream_output=True)
    else:
        run_cmd([sbt_path, "clean", "++ %s test" % scala_version], stream_output=True)


def run_python_tests(root_dir):
    print("##### Running Python tests #####")
    python_test_script = path.join(root_dir, path.join("python", "run-tests.py"))
    print("Calling script %s", python_test_script)
    run_cmd(["python", python_test_script], stream_output=True)


def run_cmd(cmd, throw_on_error=True, env=None, stream_output=False, **kwargs):
    if isinstance(cmd, str):
        old_cmd = cmd
        cmd = shlex.split(cmd)

    cmd_env = os.environ.copy()
    if env:
        cmd_env.update(env)
    print("Running command: " + str(cmd))
    if stream_output:
        child = subprocess.Popen(cmd, env=cmd_env, **kwargs)
        exit_code = child.wait()
        if throw_on_error and exit_code != 0:
            raise Exception("Non-zero exitcode: %s" % (exit_code))
        return exit_code
    else:
        child = subprocess.Popen(
            cmd,
            env=cmd_env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            **kwargs)
        (stdout, stderr) = child.communicate()
        exit_code = child.wait()
        if not isinstance(stdout, str):
            # Python 3 produces bytes which needs to be converted to str
            stdout = stdout.decode("utf-8")
            stderr = stderr.decode("utf-8")
        if throw_on_error and exit_code is not 0:
            raise Exception(
                "Non-zero exitcode: %s\n\nSTDOUT:\n%s\n\nSTDERR:%s" %
                (exit_code, stdout, stderr))
        return (exit_code, stdout, stderr)


def pull_or_build_docker_image(root_dir):
    """
    This method prepare the docker image for running tests. It uses a hash of the Dockerfile
    to generate the image tag/name so that we reuse images until the Dockerfile has changed.
    Then it tries to prepare that image by either pulling from a Docker registry
    (if configured with environment variable DOCKER_REGISTRY) or by building it from
    scratch using the Dockerfile. If pulling from registry fails, then it will fallback
    to building it from scratch, but it will also attempt to push to the registry to
    avoid image builds in the future.
    """

    dockerfile_path = os.path.join(root_dir, "Dockerfile")
    _, out, _ = run_cmd("md5sum %s" % dockerfile_path)
    dockerfile_hash = out.strip().split(" ")[0].strip()
    print("Dockerfile hash: %s" % dockerfile_hash)

    test_env_image_tag = "delta_test_env:%s" % dockerfile_hash
    print("Test env image: %s" % test_env_image_tag)

    docker_registry = os.getenv("DOCKER_REGISTRY")
    print("Docker registry set as " + str(docker_registry))


    def build_image():
        print("---\nBuilding image %s ..." % test_env_image_tag)
        run_cmd("docker build --tag=%s %s" % (test_env_image_tag, root_dir))
        print("Built image %s" % test_env_image_tag)

    def pull_image(registry_image_tag):
        try:
            print("---\nPulling image %s ..." % registry_image_tag)
            run_cmd("docker pull %s" % registry_image_tag)
            run_cmd("docker tag %s %s" % (registry_image_tag, test_env_image_tag))
            print("Pulling image %s succeeded" % registry_image_tag)
            return True
        except Exception as e:
            print("Pulling image %s failed: %s" % (registry_image_tag, repr(e)))
            return False

    def push_image(registry_image_tag):
        try:
            print("---\nPushing image %s ..." % registry_image_tag)
            run_cmd("docker tag %s %s" % (test_env_image_tag, registry_image_tag))
            run_cmd("docker push %s" % registry_image_tag)
            print("Pushing image %s succeeded" % registry_image_tag)
            return True
        except Exception as e:
            print("Pushing image %s failed: %s" % (registry_image_tag, repr(e)))
            return False

    if docker_registry is not None:
        print("Attempting to use the docker registry")
        test_env_image_tag_with_registry = docker_registry + "/delta/" + test_env_image_tag
        success = pull_image(test_env_image_tag_with_registry)
        if not success:
            build_image()
            push_image(test_env_image_tag_with_registry)
    else:
        build_image()
    return test_env_image_tag


def run_tests_in_docker(image_tag):
    """
    Run the necessary tests in a docker container made from the given image.
    It starts the container with the delta repo mounted in it, and then
    executes this script.
    """

    # Note: Pass only relevant env that the script needs to run in the docker container.
    # Do not pass docker related env variable as we want this script to run natively in
    # the container and not attempt to recursively another docker container.
    envs = "-e JENKINS_URL -e SBT_1_5_5_MIRROR_JAR_URL "
    scala_version = os.getenv("SCALA_VERSION")
    if scala_version is not None:
        envs = envs + "-e SCALA_VERSION=%s " % scala_version

    cwd = os.getcwd()
    test_script = os.path.basename(__file__)

    test_run_cmd = "docker run --rm  -v %s:%s -w %s %s %s ./%s" % (
        cwd, cwd, cwd, envs, image_tag, test_script
    )
    run_cmd(test_run_cmd, stream_output=True)


if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.abspath(__file__))
    if os.getenv("USE_DOCKER") is not None:
        test_env_image_tag = pull_or_build_docker_image(root_dir)
        run_tests_in_docker(test_env_image_tag)
    else:
        scala_version = os.getenv("SCALA_VERSION")
        run_sbt_tests(root_dir, scala_version)
        # Python tests are skipped when using Scala 2.13 as PySpark doesn't support it.
        if scala_version is None or scala_version.startswith("2.12"):
            run_python_tests(root_dir)
