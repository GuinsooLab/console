"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[8896],{88896:function(e,n,t){t.r(n);var o=t(37762),r=t(29439),l=(t(72791),t(51691)),u=t(2148),i=t(9505),c=t(3923),s=t(45248),a=t(87995),f=t(81551),h=t(80184);n.default=function(e){var n=e.selectedGroups,t=e.deleteOpen,p=e.closeDeleteModalAndRefresh,d=(0,f.TL)(),v=(0,i.Z)((function(){return p(!0)}),(function(e){d((0,a.Ih)(e)),p(!1)})),g=(0,r.Z)(v,2),x=g[0],j=g[1];if(!n)return null;var C=n.map((function(e){return(0,h.jsx)("div",{children:(0,h.jsx)("b",{children:e})},e)}));return(0,h.jsx)(u.Z,{title:"Delete Group".concat(n.length>1?"s":""),confirmText:"Delete",isOpen:t,titleIcon:(0,h.jsx)(c.NvT,{}),isLoading:x,onConfirm:function(){var e,t=(0,o.Z)(n);try{for(t.s();!(e=t.n()).done;){var r=e.value;j("DELETE","/api/v1/group/".concat((0,s.LL)(r)))}}catch(l){t.e(l)}finally{t.f()}},onClose:function(){return p(!1)},confirmationContent:(0,h.jsxs)(l.Z,{children:["Are you sure you want to delete the following ",n.length," ","group",n.length>1?"s?":"?",C]})})}}}]);
//# sourceMappingURL=8896.3cbf9873.chunk.js.map