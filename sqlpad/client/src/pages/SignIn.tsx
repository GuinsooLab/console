import GoogleIcon from 'mdi-react/GoogleIcon';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from '../common/Button';
import ButtonLink from '../common/ButtonLink';
import HSpacer from '../common/HSpacer';
import Input from '../common/Input';
import message from '../common/message';
import Spacer from '../common/Spacer';
import { api } from '../utilities/api';
import useAppContext from '../utilities/use-app-context';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const { config } = useAppContext();

  useEffect(() => {
    document.title = 'Sign In - SQLPad';
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const json = await api.post('/api/signin', { email, password });
    if (json.error) {
      return message.error('Username or password incorrect');
    }
    await api.reloadAppInfo();
    history.push('/');
  };

  if (!config) {
    return null;
  }

  let placeholderText = '';
  if (config.ldapConfigured && config.localAuthConfigured) {
    placeholderText = 'username or email address';
  } else if (config.ldapConfigured) {
    placeholderText = 'username';
  } else if (config.localAuthConfigured) {
    placeholderText = 'email address';
  }

  const localLdapForm = (
    <form onSubmit={signIn}>
      <Input
        name="email"
        type="email"
        placeholder={placeholderText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        required
      />
      <Spacer />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        required
      />
      <Spacer size={2} />
      <Button
        style={{ width: '100%' }}
        onClick={signIn}
        htmlType="submit"
        variant="primary"
      >
        Sign in
      </Button>
      <Spacer />

      {config.localAuthConfigured && (
        <Link
          style={{
            display: 'inline-block',
            width: '100%',
            textAlign: 'center',
          }}
          to="/signup"
        >
          Sign Up
        </Link>
      )}
    </form>
  );

  const googleForm = (
    <div>
      <Spacer />
      <ButtonLink
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        href={config.baseUrl + '/auth/google'}
        variant="primary"
      >
        <GoogleIcon />
        <HSpacer />
        Sign in with Google
      </ButtonLink>
    </div>
  );

  function createMarkupForSamlLink() {
    return { __html: config?.samlLinkHtml || '' };
  }

  const samlForm = (
    <div>
      <Spacer />
      <a href={config.baseUrl + '/auth/saml'}>
        <span dangerouslySetInnerHTML={createMarkupForSamlLink()} />
      </a>
    </div>
  );

  const oidcForm = (
    <div>
      <Spacer />
      <ButtonLink
        variant="primary"
        style={{
          width: '100%',
          textAlign: 'center',
        }}
        href={config.baseUrl + '/auth/oidc'}
      >
        <div
          className="w-100"
          dangerouslySetInnerHTML={{ __html: config.oidcLinkHtml }}
        />
      </ButtonLink>
    </div>
  );

  return (
    <div style={{
      backgroundImage: `url('/src/images/background-wave-orig2.svg'), url('/src/images/background.svg')`,
      backgroundPosition: "center 250px, center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "2547px 980px,cover",
      backgroundBlendMode: "color-dodge",
      width: "100vw",
      height: "100vh",
      display: "flex",
      color: "#fff",
      overflow: "auto",
    }}>
      <div style={{width: '400px', textAlign: 'center', margin: '128px auto',}}>
        <div style={{
          background: "linear-gradient(rgb(251, 250, 250) 0%, rgb(228, 228, 228) 100%) 0% 0% no-repeat padding-box padding-box transparent",
          padding: "40px",
          color: "rgb(8, 28, 66)"
        }}>
          <div style={{width: "100%"}}>
            <svg style={{width: "100%", height: "100%"}} fill="currentcolor" width="1538px" height="480px"
                 viewBox="0 0 1538 480"
                 version="1.1" xmlns="http://www.w3.org/2000/svg"><title>console-text</title>
              <g id="console-text" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <polygon id="Path-6" fill="#081c42" points="0 0 0 480 480 480 480 0"></polygon>
                <g id="C-ONSOLE" transform="translate(276.046875, 248.164062)" fill-rule="nonzero">
                  <path
                    d="M77.2265625,181.289062 C100.429688,181.289062 118.867188,173.90625 132.539062,159.140625 C143.945312,146.875 150.664062,131.679688 152.695312,113.554688 L152.695312,113.554688 L129.960938,113.554688 C127.617188,124.882812 124.0625,134.023438 119.296875,140.976562 C110.3125,154.179688 97.2265625,160.78125 80.0390625,160.78125 C61.3671875,160.78125 47.3242188,154.511719 37.9101562,141.972656 C28.4960938,129.433594 23.7890625,113.085938 23.7890625,92.9296875 C23.7890625,68.3203125 29.0039062,50.0585938 39.4335938,38.1445312 C49.8632812,26.2304688 63.5546875,20.2734375 80.5078125,20.2734375 C94.4140625,20.2734375 105.214844,23.515625 112.910156,30 C120.605469,36.484375 125.742188,45.2734375 128.320312,56.3671875 L128.320312,56.3671875 L151.054688,56.3671875 C149.726562,41.7578125 143.046875,28.7109375 131.015625,17.2265625 C118.984375,5.7421875 102.070312,0 80.2734375,0 C54.7265625,0 34.6875,8.828125 20.15625,26.484375 C6.71875,42.734375 0,63.5546875 0,88.9453125 C0,122.382813 8.9453125,147.109375 26.8359375,163.125 C40.4296875,175.234375 57.2265625,181.289062 77.2265625,181.289062 Z"
                    id="C" fill="#FFFFFF"></path>
                  <path
                    d="M321.5625,181.875 C349.921875,181.875 371.757812,171.875 387.070312,151.875 C400.117188,134.84375 406.640625,113.476562 406.640625,87.7734375 C406.640625,64.0234375 400.9375,44.53125 389.53125,29.296875 C374.921875,9.765625 352.421875,0 322.03125,0 C292.96875,0 271.015625,10.625 256.171875,31.875 C244.609375,48.4375 238.828125,68.359375 238.828125,91.640625 C238.828125,117.421875 245.585938,138.75 259.101562,155.625 C274.257812,173.125 295.078125,181.875 321.5625,181.875 Z M324.375,161.015625 C302.734375,161.015625 287.089844,154.472656 277.441406,141.386719 C267.792969,128.300781 262.96875,112.226562 262.96875,93.1640625 C262.96875,69.3359375 268.59375,51.3085938 279.84375,39.0820312 C291.09375,26.8554688 305.625,20.7421875 323.4375,20.7421875 C341.796875,20.7421875 356.269531,26.9140625 366.855469,39.2578125 C377.441406,51.6015625 382.734375,67.890625 382.734375,88.125 C382.734375,107.265625 378.144531,124.199219 368.964844,138.925781 C359.785156,153.652344 344.921875,161.015625 324.375,161.015625 Z M456.679688,176.835938 L456.679688,37.5 L544.921875,176.835938 L571.054688,176.835938 L571.054688,4.6875 L548.90625,4.6875 L548.90625,144.140625 L461.953125,4.6875 L434.414062,4.6875 L434.414062,176.835938 L456.679688,176.835938 Z M669.140625,181.875 C687.5,181.875 703.613281,177.773438 717.480469,169.570312 C731.347656,161.367188 738.28125,147.734375 738.28125,128.671875 C738.28125,113.359375 732.8125,101.679688 721.875,93.6328125 C715.546875,89.0234375 706.5625,85.390625 694.921875,82.734375 L694.921875,82.734375 L670.78125,77.2265625 C654.53125,73.4765625 644.101562,70.3515625 639.492188,67.8515625 C632.460938,63.9453125 628.945312,57.7734375 628.945312,49.3359375 C628.945312,41.6796875 631.953125,34.9609375 637.96875,29.1796875 C643.984375,23.3984375 653.867188,20.5078125 667.617188,20.5078125 C684.648438,20.5078125 696.71875,25 703.828125,33.984375 C707.65625,38.90625 710.15625,45.9765625 711.328125,55.1953125 L711.328125,55.1953125 L733.242188,55.1953125 C733.242188,36.0546875 726.933594,22.1289062 714.316406,13.4179688 C701.699219,4.70703125 686.367188,0.3515625 668.320312,0.3515625 C648.710938,0.3515625 633.554688,5.3125 622.851562,15.234375 C612.148438,25.15625 606.796875,37.8515625 606.796875,53.3203125 C606.796875,67.6171875 612.265625,78.359375 623.203125,85.546875 C629.53125,89.6875 640.3125,93.4765625 655.546875,96.9140625 L655.546875,96.9140625 L678.867188,102.1875 C691.523438,105.078125 700.820312,108.476562 706.757812,112.382812 C712.617188,116.367188 715.546875,123.046875 715.546875,132.421875 C715.546875,144.921875 708.59375,153.59375 694.6875,158.4375 C687.5,160.9375 679.53125,162.1875 670.78125,162.1875 C651.25,162.1875 637.617188,156.484375 629.882812,145.078125 C625.820312,138.984375 623.515625,131.054688 622.96875,121.289062 L622.96875,121.289062 L601.054688,121.289062 C600.820312,139.882812 606.757812,154.609375 618.867188,165.46875 C630.976562,176.40625 647.734375,181.875 669.140625,181.875 Z M841.640625,181.875 C870,181.875 891.835938,171.875 907.148438,151.875 C920.195312,134.84375 926.71875,113.476562 926.71875,87.7734375 C926.71875,64.0234375 921.015625,44.53125 909.609375,29.296875 C895,9.765625 872.5,0 842.109375,0 C813.046875,0 791.09375,10.625 776.25,31.875 C764.6875,48.4375 758.90625,68.359375 758.90625,91.640625 C758.90625,117.421875 765.664062,138.75 779.179688,155.625 C794.335938,173.125 815.15625,181.875 841.640625,181.875 Z M844.453125,161.015625 C822.8125,161.015625 807.167969,154.472656 797.519531,141.386719 C787.871094,128.300781 783.046875,112.226562 783.046875,93.1640625 C783.046875,69.3359375 788.671875,51.3085938 799.921875,39.0820312 C811.171875,26.8554688 825.703125,20.7421875 843.515625,20.7421875 C861.875,20.7421875 876.347656,26.9140625 886.933594,39.2578125 C897.519531,51.6015625 902.8125,67.890625 902.8125,88.125 C902.8125,107.265625 898.222656,124.199219 889.042969,138.925781 C879.863281,153.652344 865,161.015625 844.453125,161.015625 Z M1065,176.835938 L1065,156.328125 L977.8125,156.328125 L977.8125,4.6875 L954.492188,4.6875 L954.492188,176.835938 L1065,176.835938 Z M1217.46094,176.835938 L1217.46094,156.328125 L1112.92969,156.328125 L1112.92969,97.96875 L1207.96875,97.96875 L1207.96875,78.046875 L1112.92969,78.046875 L1112.92969,25.78125 L1215.70312,25.78125 L1215.70312,4.6875 L1090.19531,4.6875 L1090.19531,176.835938 L1217.46094,176.835938 Z"
                    id="ONSOLE" fill="#000000"></path>
                </g>
              </g>
            </svg>
          </div>
          <div style={{textAlign: "left", color: "rgb(8, 28, 66)", marginTop: 4}}>
            <b style={{fontWeight: 700}}>SQLPad</b> | Powered by GuinsooLab Console
          </div>
        </div>
        <div style={{backgroundColor: "#ffffff", padding: "40px", color: "rgb(8, 28, 66)"}}>
          {(config.localAuthConfigured || config.ldapConfigured) && localLdapForm}
          {config.googleAuthConfigured && googleForm}
          {config.samlConfigured && samlForm}
          {config.oidcConfigured && oidcForm}
          <div style={{
            textAlign: "center",
            marginTop: 20,
          }}>
            <a
              href={"https://ciusji.gitbook.io/guinsoolab/products/console"}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "rgb(39, 129, 176)",
                font: "normal normal normal 12px/15px Lato",
              }}
            >
              Learn more about CONSOLE
            </a>
            <a href="https://ciusji.gitbook.io/guinsoolab/products/console" style={{
              color: "rgb(39, 129, 176)",
              font: "bold 12px / 15px Lato",
              textDecoration: "none",
              paddingLeft: 4
            }}>➔</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
