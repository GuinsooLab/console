import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import AppHeader from '../app-header/AppHeader';
import { debouncedResizeChart } from '../common/tauChartRef';
import SchemaInfoLoader from '../schema/SchemaInfoLoader';
import { connectConnectionClient, loadQuery } from '../stores/editor-actions';
import useShortcuts from '../utilities/use-shortcuts';
import DocumentTitle from './DocumentTitle';
import EditorNavProtection from './EditorNavProtection';
import EditorPaneRightSidebar from './EditorPaneRightSidebar';
import EditorPaneSchemaSidebar from './EditorPaneSchemaSidebar';
import EditorPaneVis from './EditorPaneVis';
import NotFoundModal from './NotFoundModal';
import QueryEditorResultPane from './QueryEditorResultPane';
import QueryEditorSqlEditor from './QueryEditorSqlEditor';
import QuerySaveModal from './QuerySaveModal';
import Toolbar from './Toolbar';
import UnsavedQuerySelector from './UnsavedQuerySelector';
import styles from './ConnectionDropdown.module.css';

import GuinsooLabIcon from "../images/guinsoolab.svg";
import DiscoveryIcon from "../images/discovery.svg";
import QueryIcon from "../images/query.svg";
import StorageIcon from "../images/storage.svg";
import ProcessIcon from "../images/process.svg";
import FlowIcon from "../images/flow.svg";
import ObservabilityIcon from "../images/observe.svg";
import SqlPadIcon from "../images/sqlpad.svg";
import MarketIcon from "../images/Apps.svg";
import SettingIcon from "../images/Settting.svg";
import LineIcon from "../images/Line.svg";
import TerminalIcon from "../images/terminal.svg";
import HelpIcon from "../images/Help.svg";

interface Params {
  queryId?: string;
}

function QueryEditor() {
  const [showNotFound, setShowNotFound] = useState(false);
  const { queryId = '' } = useParams<Params>();
  useShortcuts();

  // On queryId change from URL string, load query as needed.
  // If queryId does not exist, it is because the route is hitting `/queries/new` which avoids sending a queryId param
  // In the case of new query, the state is already set.
  // Either user landed here fresh (new query is set by default)
  // or they clicked new query button, which resets state on click.
  // Calling resetNewQuery here should not be necessary.
  // If query is not found, show the not found modal to inform user and prompt to start new query.
  useEffect(() => {
    setShowNotFound(false);
    if (queryId === '') {
      connectConnectionClient();
    } else if (queryId) {
      loadQuery(queryId).then(({ error, data }) => {
        if (error || !data) {
          return setShowNotFound(true);
        }
        connectConnectionClient();
      });
    }
  }, [queryId]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 60,
        paddingTop: 47,
      }}
    >
      <AppHeader />
      <Toolbar />
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <EditorPaneRightSidebar queryId={queryId}>
          <EditorPaneSchemaSidebar queryId={queryId}>
            <SplitPane
              split="horizontal"
              minSize={100}
              defaultSize={'60%'}
              maxSize={-100}
              onChange={() => debouncedResizeChart(queryId)}
            >
              <EditorPaneVis queryId={queryId}>
                <QueryEditorSqlEditor />
              </EditorPaneVis>
              <QueryEditorResultPane />
            </SplitPane>
          </EditorPaneSchemaSidebar>
        </EditorPaneRightSidebar>
      </div>
      <UnsavedQuerySelector queryId={queryId} />
      <DocumentTitle queryId={queryId} />
      <SchemaInfoLoader />
      <QuerySaveModal />
      <NotFoundModal visible={showNotFound} queryId={queryId} />
      <EditorNavProtection />
      <div className={styles.appNav}>
        <img src={GuinsooLabIcon} width={60} height={47} alt="logo" />
        <ul className={styles.appNavUl}>
          <li className={styles.appNavLi}
            onClick={() => window.open("http://localhost:3000/sqlpad/queries/new")}
          >
            <img className={styles.appNavImg} src={SqlPadIcon} alt="data-pad"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={DiscoveryIcon} alt="data-discovery"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={QueryIcon} alt="data-query"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={StorageIcon} alt="data-storage"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={ProcessIcon} alt="data-process"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={FlowIcon} alt="data-flow"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={ObservabilityIcon} alt="data-observability"/>
          </li>
          <li style={{height: 20, listStyle: "none"}}>
            <img className={styles.appNavImg} src={LineIcon} style={{width: 40, padding: 0, height: 1}} alt="line"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={MarketIcon} alt="data-market"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={TerminalIcon} alt="data-terminal"/>
          </li>
          <li className={styles.appNavLi}>
            <img className={styles.appNavImg} src={SettingIcon} alt="data-setting"/>
          </li>
          <li style={{position: "absolute", left: 0, bottom: 0, width: 60, height: 50, padding: 7}}>
            <img
              src={HelpIcon}
              className={styles.appHelpImg}
              onClick={() => window.open("https://ciusji.gitbook.io/guinsoolab/appendix/support", "_blank")}
              alt="data-help"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default QueryEditor;
