"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[402],{70402:function(n,e,i){i.r(e);var t=i(29439),o=i(72791),r=i(51691),s=i(81207),a=i(2148),c=i(3923),l=i(87995),u=i(81551),d=i(80184);e.default=function(n){var e=n.closeVersioningModalAndRefresh,i=n.modalOpen,f=n.selectedBucket,h=n.versioningCurrentState,b=(0,u.TL)(),g=(0,o.useState)(!1),p=(0,t.Z)(g,2),v=p[0],j=p[1];return(0,d.jsx)(a.Z,{title:"Versioning on Bucket",confirmText:h?"Disable":"Enable",isOpen:i,isLoading:v,titleIcon:(0,d.jsx)(c.EjK,{}),onConfirm:function(){v||(j(!0),s.Z.invoke("PUT","/api/v1/buckets/".concat(f,"/versioning"),{versioning:!h}).then((function(){j(!1),e(!0)})).catch((function(n){j(!1),b((0,l.Ih)(n))})))},confirmButtonProps:{color:"primary",variant:"contained"},onClose:function(){e(!1)},confirmationContent:(0,d.jsxs)(r.Z,{id:"alert-dialog-description",children:["Are you sure you want to"," ",(0,d.jsx)("strong",{children:h?"disable":"enable"})," ","versioning for this bucket?",h&&(0,d.jsxs)(o.Fragment,{children:[(0,d.jsx)("br",{}),(0,d.jsx)("br",{}),(0,d.jsx)("strong",{children:"File versions won't be automatically deleted."})]})]})})}}}]);
//# sourceMappingURL=402.89c71117.chunk.js.map