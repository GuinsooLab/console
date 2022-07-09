"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[736],{23804:function(e,t,n){n(72791);var i=n(11135),o=n(25787),r=n(61889),a=n(80184);t.Z=(0,o.Z)((function(e){return(0,i.Z)({root:{border:"1px solid #E2E2E2",borderRadius:2,backgroundColor:"#FBFAFA",paddingLeft:25,paddingTop:31,paddingBottom:21,paddingRight:30},leftItems:{fontSize:16,fontWeight:"bold",marginBottom:15,display:"flex",alignItems:"center","& .min-icon":{marginRight:15,height:28,width:38}},helpText:{fontSize:16,paddingLeft:5}})}))((function(e){var t=e.classes,n=e.iconComponent,i=e.title,o=e.help;return(0,a.jsx)("div",{className:t.root,children:(0,a.jsxs)(r.ZP,{container:!0,children:[(0,a.jsxs)(r.ZP,{item:!0,xs:12,className:t.leftItems,children:[n,i]}),(0,a.jsx)(r.ZP,{item:!0,xs:12,className:t.helpText,children:o})]})})}))},81806:function(e,t,n){var i=n(1413),o=n(45987),r=(n(72791),n(11135)),a=n(25787),s=n(80184),l=["classes","children"];t.Z=(0,a.Z)((function(e){return(0,r.Z)({root:{padding:0,margin:0,border:0,backgroundColor:"transparent",textDecoration:"underline",cursor:"pointer",fontSize:"inherit",color:e.palette.info.main,fontFamily:"Lato, sans-serif"}})}))((function(e){var t=e.classes,n=e.children,r=(0,o.Z)(e,l);return(0,s.jsx)("button",(0,i.Z)((0,i.Z)({},r),{},{className:t.root,children:n}))}))},56028:function(e,t,n){var i=n(29439),o=n(1413),r=n(72791),a=n(60364),s=n(13400),l=n(55646),c=n(5574),d=n(65661),u=n(39157),p=n(11135),m=n(25787),x=n(23814),f=n(81551),h=n(29823),g=n(28057),v=n(87995),Z=n(80184);t.Z=(0,m.Z)((function(e){return(0,p.Z)((0,o.Z)((0,o.Z)({},x.Qw),{},{content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},x.sN))}))((function(e){var t=e.onClose,n=e.modalOpen,p=e.title,m=e.children,x=e.classes,b=e.wideLimit,j=void 0===b||b,y=e.noContentPadding,C=e.titleIcon,I=void 0===C?null:C,S=(0,f.TL)(),k=(0,r.useState)(!1),D=(0,i.Z)(k,2),E=D[0],R=D[1],T=(0,a.v9)((function(e){return e.system.modalSnackBar}));(0,r.useEffect)((function(){S((0,v.MK)(""))}),[S]),(0,r.useEffect)((function(){if(T){if(""===T.message)return void R(!1);"error"!==T.type&&R(!0)}}),[T]);var w=j?{classes:{paper:x.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},O="";return T&&(O=T.detailedErrorMsg,(""===T.detailedErrorMsg||T.detailedErrorMsg.length<5)&&(O=T.message)),(0,Z.jsxs)(c.Z,(0,o.Z)((0,o.Z)({open:n,classes:x},w),{},{scroll:"paper",onClose:function(e,n){"backdropClick"!==n&&t()},className:x.root,children:[(0,Z.jsxs)(d.Z,{className:x.title,children:[(0,Z.jsxs)("div",{className:x.titleText,children:[I," ",p]}),(0,Z.jsx)("div",{className:x.closeContainer,children:(0,Z.jsx)(s.Z,{"aria-label":"close",id:"close",className:x.closeButton,onClick:t,disableRipple:!0,size:"small",children:(0,Z.jsx)(h.Z,{})})})]}),(0,Z.jsx)(g.Z,{isModal:!0}),(0,Z.jsx)(l.Z,{open:E,className:x.snackBarModal,onClose:function(){R(!1),S((0,v.MK)(""))},message:O,ContentProps:{className:"".concat(x.snackBar," ").concat(T&&"error"===T.type?x.errorSnackBar:"")},autoHideDuration:T&&"error"===T.type?1e4:5e3}),(0,Z.jsx)(u.Z,{className:y?"":x.content,children:m})]}))}))},736:function(e,t,n){n.r(t),n.d(t,{default:function(){return A}});var i=n(1413),o=n(29439),r=n(72791),a=n(16871),s=n(64554),l=n(61889),c=n(51691),d=n(32291),u=n(74794),p=n(9505),m=n(90493),x=n(76278),f=n(20068),h=n(36151),g=n(40603),v=n(54599),Z=n(3923),b=n(2148),j=n(21435),y=n(56028),C=n(25787),I=n(11135),S=n(23814),k=n(87995),D=n(81551),E=n(80184),R=(0,C.Z)((function(e){return(0,I.Z)((0,i.Z)((0,i.Z)((0,i.Z)({},S.ID),S.DF),S.bK))}))((function(e){var t=e.sites,n=e.onDeleteSite,i=e.onRefresh,a=e.classes,d=(0,D.TL)(),u=(0,r.useState)(""),C=(0,o.Z)(u,2),I=C[0],S=C[1],R=(0,r.useState)(null),T=(0,o.Z)(R,2),w=T[0],O=T[1],N=(0,r.useState)(""),A=(0,o.Z)(N,2),F=A[0],B=A[1],P=(0,p.Z)((function(e){e.success?(O(null),d((0,k.y1)(e.status))):d((0,k.Ih)({errorMessage:"Error",detailedError:e.status})),i()}),(function(e){d((0,k.Ih)(e)),i()})),L=(0,o.Z)(P,2),M=L[0],_=L[1],G=!1;try{new URL(F),G=!0}catch(W){G=!1}return(0,E.jsx)(s.Z,{children:(0,E.jsxs)(m.Z,{sx:{width:"100%",flex:1,padding:"0",marginTop:"25px",height:"calc( 100vh - 450px )",border:"1px solid #eaeaea",marginBottom:"25px"},component:"nav","aria-labelledby":"nested-list-subheader",children:[(0,E.jsx)(s.Z,{sx:{fontWeight:600,borderBottom:"1px solid #f1f1f1",padding:"25px 25px 25px 20px"},children:"List of Replicated Sites"}),t.map((function(e,i){var o="".concat(e.name);return(0,E.jsxs)(r.Fragment,{children:[(0,E.jsxs)(x.Z,{disableRipple:!0,sx:{display:"flex",alignItems:"center",border:"1px solid #f1f1f1",borderLeft:"0",borderRight:"0",borderTop:"0",padding:"6px 10px 6px 20px","&:hover":{background:"#bebbbb0d"},"&.expanded":{marginBottom:"0"}},children:[(0,E.jsxs)(s.Z,{sx:{flex:2,display:"grid",gridTemplateColumns:{sm:"1fr 1fr "}},children:[(0,E.jsx)(s.Z,{sx:{display:"flex",alignItems:"center",overflow:"hidden"},children:e.name}),(0,E.jsxs)(s.Z,{sx:{display:"flex",alignItems:"center",overflow:"hidden"},children:[e.isCurrent?(0,E.jsx)(f.Z,{title:"This site/cluster",placement:"top",children:(0,E.jsx)(s.Z,{sx:{"& .min-icon":{height:"12px",fill:"green"}},children:(0,E.jsx)(Z.J$M,{})})}):null,(0,E.jsx)(f.Z,{title:e.endpoint,children:(0,E.jsx)(s.Z,{sx:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginLeft:e.isCurrent?"":"24px"},children:e.endpoint})})]})]}),(0,E.jsxs)(s.Z,{sx:{display:"flex",marginLeft:"25px",marginRight:"25px",width:"60px",flexShrink:0,"& button":{borderRadius:"50%",background:"#F8F8F8",border:"none","&:hover":{background:"#E2E2E2"},"& svg":{fill:"#696565"}}},children:[(0,E.jsx)(g.Z,{tooltip:t.length<=2?"Minimum two sites are required for replication":"Delete Site",text:"",variant:"outlined",color:"secondary",disabled:t.length<=2,icon:(0,E.jsx)(v.Z,{}),onClick:function(e){e.preventDefault(),S(o)}}),(0,E.jsx)(g.Z,{tooltip:"Edit Endpoint",text:"",variant:"contained",color:"primary",icon:(0,E.jsx)(Z.dY8,{}),onClick:function(t){t.preventDefault(),O(e)}})]})]}),I===o?(0,E.jsx)(b.Z,{title:"Delete Replication Site",confirmText:"Delete",isOpen:!0,titleIcon:(0,E.jsx)(Z.NvT,{}),isLoading:!1,onConfirm:function(){n(!1,[o])},onClose:function(){S("")},confirmationContent:(0,E.jsxs)(c.Z,{children:["Are you sure you want to remove the replication site:"," ",o,".?"]})}):null,(null===w||void 0===w?void 0:w.name)===o?(0,E.jsxs)(y.Z,{title:"Edit Replication Endpoint ",modalOpen:!0,titleIcon:(0,E.jsx)(Z.dY8,{}),onClose:function(){O(null)},children:[(0,E.jsxs)(c.Z,{children:[(0,E.jsxs)(s.Z,{sx:{display:"flex",flexFlow:"column",marginBottom:"15px"},children:[(0,E.jsxs)(s.Z,{sx:{marginBottom:"10px"},children:[(0,E.jsx)("strong",{children:"Site:"})," ","  ",w.name]}),(0,E.jsxs)(s.Z,{sx:{marginBottom:"10px"},children:[(0,E.jsx)("strong",{children:"Current Endpoint:"})," ","  ",w.endpoint]})]}),(0,E.jsxs)(l.ZP,{item:!0,xs:12,children:[(0,E.jsx)(s.Z,{sx:{marginBottom:"5px"},children:" New Endpoint:"}),(0,E.jsx)(j.Z,{id:"edit-rep-peer-endpoint",name:"edit-rep-peer-endpoint",placeholder:"https://dr.minio-storage:9000",onChange:function(e){B(e.target.value)},label:"",value:F})]})]}),(0,E.jsxs)(l.ZP,{item:!0,xs:12,className:a.modalButtonBar,children:[(0,E.jsx)(h.Z,{type:"button",variant:"outlined",color:"primary",onClick:function(){O(null)},children:"Close"}),(0,E.jsx)(h.Z,{type:"button",variant:"contained",color:"primary",disabled:M||!G,onClick:function(){_("PUT","api/v1/admin/site-replication",{endpoint:F,name:w.name,deploymentId:w.deploymentID})},children:"Update"})]})]}):null]},"".concat(o,"-").concat(i))}))]})})})),T=n(72401),w=n(23804),O=n(56087),N=n(81806),A=function(){var e=(0,D.TL)(),t=(0,a.s0)(),n=(0,r.useState)([]),m=(0,o.Z)(n,2),x=m[0],f=m[1],h=(0,r.useState)(!1),j=(0,o.Z)(h,2),y=j[0],C=j[1],I=(0,p.Z)((function(e){var t=e.sites,n=e.name,o=t.findIndex((function(e){return e.name===n}));if(-1!==o){var r=t[o];r=(0,i.Z)((0,i.Z)({},r),{},{isCurrent:!0}),t.splice(o,1,r)}t.sort((function(e,t){return e.name===n?-1:t.name===n?1:0})),f(t)}),(function(e){f([])})),S=(0,o.Z)(I,2),A=S[0],F=S[1],B=function(){F("GET","api/v1/admin/site-replication")},P=(0,p.Z)((function(t){C(!1),e((0,k.y1)("Successfully deleted.")),B()}),(function(t){e((0,k.Ih)(t))})),L=(0,o.Z)(P,2),M=L[0],_=L[1],G=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];_("DELETE","api/v1/admin/site-replication",{all:e,sites:t})};(0,r.useEffect)((function(){B()}),[]);var W=null===x||void 0===x?void 0:x.length;return(0,E.jsxs)(r.Fragment,{children:[(0,E.jsx)(d.Z,{label:"Site Replication"}),(0,E.jsxs)(u.Z,{children:[(0,E.jsxs)(s.Z,{sx:{display:"flex",alignItems:"center",justifyContent:"flex-end"},children:[W?(0,E.jsxs)(s.Z,{children:[(0,E.jsx)(g.Z,{tooltip:"Delete All",text:"Delete All",variant:"outlined",color:"secondary",disabled:M,icon:(0,E.jsx)(v.Z,{}),onClick:function(){C(!0)}}),(0,E.jsx)(g.Z,{tooltip:"Replication Status",text:"Replication Status",variant:"outlined",color:"primary",icon:(0,E.jsx)(Z.D7Y,{}),onClick:function(e){e.preventDefault(),t(O.gA.SITE_REPLICATION_STATUS)}})]}):null,(0,E.jsx)(g.Z,{tooltip:"Add Replication Sites",text:"Add Sites",variant:"contained",color:"primary",disabled:M,icon:(0,E.jsx)(Z.dtP,{}),onClick:function(){t(O.gA.SITE_REPLICATION_ADD)}})]}),W?(0,E.jsx)(R,{sites:x,onDeleteSite:G,onRefresh:B}):null,A?(0,E.jsx)(s.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",height:"calc( 100vh - 450px )"},children:(0,E.jsx)(T.Z,{style:{width:16,height:16}})}):null,W||A?null:(0,E.jsx)(l.ZP,{container:!0,justifyContent:"center",alignContent:"center",alignItems:"center",children:(0,E.jsx)(l.ZP,{item:!0,xs:8,children:(0,E.jsx)(w.Z,{title:"Site Replication",iconComponent:(0,E.jsx)(Z.aWt,{}),help:(0,E.jsxs)(r.Fragment,{children:["This feature allows multiple independent MinIO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas.",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"To get started,"," ",(0,E.jsx)(N.Z,{onClick:function(){t(O.gA.SITE_REPLICATION_ADD)},children:"Add a Replication Site"}),".",(0,E.jsx)("br",{}),"You can learn more at our"," ",(0,E.jsx)("a",{href:"https://github.com/minio/minio/tree/master/docs/site-replication?ref=con",target:"_blank",rel:"noreferrer",children:"documentation"}),"."]})})})}),W&&!A?(0,E.jsx)(w.Z,{title:"Site Replication",iconComponent:(0,E.jsx)(Z.aWt,{}),help:(0,E.jsxs)(r.Fragment,{children:["This feature allows multiple independent MinIO sites (or clusters) that are using the same external IDentity Provider (IDP) to be configured as replicas. In this situation the set of replica sites are referred to as peer sites or just sites.",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"Initially, only one of the sites added for replication may have data. After site-replication is successfully configured, this data is replicated to the other (initially empty) sites. Subsequently, objects may be written to any of the sites, and they will be replicated to all other sites.",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"All sites must have the same deployment credentials (i.e. MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"All sites must be using the same external IDP(s) if any.",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"For SSE-S3 or SSE-KMS encryption via KMS, all sites must have access to a central KMS deployment server.",(0,E.jsx)("br",{}),(0,E.jsx)("br",{}),"You can learn more at our"," ",(0,E.jsx)("a",{href:"https://github.com/minio/minio/tree/master/docs/site-replication?ref=con",target:"_blank",rel:"noreferrer",children:"documentation"}),"."]})}):null,y?(0,E.jsx)(b.Z,{title:"Delete All",confirmText:"Delete",isOpen:!0,titleIcon:(0,E.jsx)(Z.NvT,{}),isLoading:!1,onConfirm:function(){var e=x.map((function(e){return e.name}));G(!0,e)},onClose:function(){C(!1)},confirmationContent:(0,E.jsx)(c.Z,{children:"Are you sure you want to remove all the replication sites?."})}):null]})]})}},76278:function(e,t,n){var i=n(4942),o=n(63366),r=n(87462),a=n(72791),s=n(28182),l=n(94419),c=n(12065),d=n(66934),u=n(31402),p=n(95080),m=n(40162),x=n(42071),f=n(66199),h=n(34065),g=n(80184),v=["alignItems","autoFocus","component","children","dense","disableGutters","divider","focusVisibleClassName","selected"],Z=(0,d.ZP)(p.Z,{shouldForwardProp:function(e){return(0,d.FO)(e)||"classes"===e},name:"MuiListItemButton",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.dense&&t.dense,"flex-start"===n.alignItems&&t.alignItemsFlexStart,n.divider&&t.divider,!n.disableGutters&&t.gutters]}})((function(e){var t,n=e.theme,o=e.ownerState;return(0,r.Z)((t={display:"flex",flexGrow:1,justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minWidth:0,boxSizing:"border-box",textAlign:"left",paddingTop:8,paddingBottom:8,transition:n.transitions.create("background-color",{duration:n.transitions.duration.shortest}),"&:hover":{textDecoration:"none",backgroundColor:(n.vars||n).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},(0,i.Z)(t,"&.".concat(h.Z.selected),(0,i.Z)({backgroundColor:n.vars?"rgba(".concat(n.vars.palette.primary.mainChannel," / ").concat(n.vars.palette.action.selectedOpacity,")"):(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity)},"&.".concat(h.Z.focusVisible),{backgroundColor:n.vars?"rgba(".concat(n.vars.palette.primary.mainChannel," / calc(").concat(n.vars.palette.action.selectedOpacity," + ").concat(n.vars.palette.action.focusOpacity,"))"):(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.focusOpacity)})),(0,i.Z)(t,"&.".concat(h.Z.selected,":hover"),{backgroundColor:n.vars?"rgba(".concat(n.vars.palette.primary.mainChannel," / calc(").concat(n.vars.palette.action.selectedOpacity," + ").concat(n.vars.palette.action.hoverOpacity,"))"):(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity+n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:n.vars?"rgba(".concat(n.vars.palette.primary.mainChannel," / ").concat(n.vars.palette.action.selectedOpacity,")"):(0,c.Fq)(n.palette.primary.main,n.palette.action.selectedOpacity)}}),(0,i.Z)(t,"&.".concat(h.Z.focusVisible),{backgroundColor:(n.vars||n).palette.action.focus}),(0,i.Z)(t,"&.".concat(h.Z.disabled),{opacity:(n.vars||n).palette.action.disabledOpacity}),t),o.divider&&{borderBottom:"1px solid ".concat((n.vars||n).palette.divider),backgroundClip:"padding-box"},"flex-start"===o.alignItems&&{alignItems:"flex-start"},!o.disableGutters&&{paddingLeft:16,paddingRight:16},o.dense&&{paddingTop:4,paddingBottom:4})})),b=a.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiListItemButton"}),i=n.alignItems,c=void 0===i?"center":i,d=n.autoFocus,p=void 0!==d&&d,b=n.component,j=void 0===b?"div":b,y=n.children,C=n.dense,I=void 0!==C&&C,S=n.disableGutters,k=void 0!==S&&S,D=n.divider,E=void 0!==D&&D,R=n.focusVisibleClassName,T=n.selected,w=void 0!==T&&T,O=(0,o.Z)(n,v),N=a.useContext(f.Z),A={dense:I||N.dense||!1,alignItems:c,disableGutters:k},F=a.useRef(null);(0,m.Z)((function(){p&&F.current&&F.current.focus()}),[p]);var B=(0,r.Z)({},n,{alignItems:c,dense:A.dense,disableGutters:k,divider:E,selected:w}),P=function(e){var t=e.alignItems,n=e.classes,i=e.dense,o=e.disabled,a={root:["root",i&&"dense",!e.disableGutters&&"gutters",e.divider&&"divider",o&&"disabled","flex-start"===t&&"alignItemsFlexStart",e.selected&&"selected"]},s=(0,l.Z)(a,h.t,n);return(0,r.Z)({},n,s)}(B),L=(0,x.Z)(F,t);return(0,g.jsx)(f.Z.Provider,{value:A,children:(0,g.jsx)(Z,(0,r.Z)({ref:L,href:O.href||O.to,component:(O.href||O.to)&&"div"===j?"a":j,focusVisibleClassName:(0,s.Z)(P.focusVisible,R),ownerState:B},O,{classes:P,children:y}))})}));t.Z=b}}]);
//# sourceMappingURL=736.86840c49.chunk.js.map