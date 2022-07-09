(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[7798],{37798:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return C}});var r=n(1413),o=n(72791),a=n(26181),i=n.n(a),l=n(11135),c=n(25787),s=n(56028),u=n(61889),d=n(77196),p=n(63466),f=n(85531),y=n(78029),m=n.n(y),h=n(3923),b=n(23814),g=n(80184),v=(0,c.Z)((function(e){return(0,l.Z)({container:{display:"flex",flexFlow:"column",padding:"20px 0 8px 0"},inputWithCopy:{"& .MuiInputBase-root ":{width:"100%",background:"#FBFAFA","& .MuiInputBase-input":{height:".8rem"},"& .MuiInputAdornment-positionEnd":{marginRight:".5rem","& .MuiButtonBase-root":{height:"2rem"}}},"& .MuiButtonBase-root .min-icon":{width:".8rem",height:".8rem"}},inputLabel:(0,r.Z)((0,r.Z)({},b.YI.inputLabel),{},{fontSize:".8rem"})})}))((function(e){var t=e.label,n=void 0===t?"":t,r=e.value,o=void 0===r?"":r,a=e.classes,i=void 0===a?{}:a;return(0,g.jsxs)("div",{className:i.container,children:[(0,g.jsxs)("div",{className:i.inputLabel,children:[n,":"]}),(0,g.jsx)("div",{className:i.inputWithCopy,children:(0,g.jsx)(d.Z,{value:o,readOnly:!0,endAdornment:(0,g.jsx)(p.Z,{position:"end",children:(0,g.jsx)(m(),{text:o,children:(0,g.jsx)(f.Z,{"aria-label":"copy",tooltip:"Copy",onClick:function(){},onMouseDown:function(){},edge:"end",children:(0,g.jsx)(h.TIy,{})})})})})})]})})),x=n(89357),j=n(40603),w=function(e,t){var n=document.createElement("a");n.setAttribute("href","data:text/plain;charset=utf-8,"+t),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)},C=(0,c.Z)((function(e){return(0,l.Z)({warningBlock:{color:"red",fontSize:".85rem",margin:".5rem 0 .5rem 0",display:"flex",alignItems:"center","& svg ":{marginRight:".3rem",height:16,width:16}},credentialTitle:{padding:".8rem 0 0 0",fontWeight:600,fontSize:".9rem"},buttonContainer:{textAlign:"right",marginTop:"1rem"},credentialsPanel:{overflowY:"auto",maxHeight:350},promptTitle:{display:"flex",alignItems:"center"},buttonSpacer:{marginRight:".9rem"}})}))((function(e){var t=e.classes,n=e.newServiceAccount,a=e.open,l=e.closeModal,c=e.entity;if(!n)return null;var d=i()(n,"console",null),p=i()(n,"idp",!1);return(0,g.jsx)(s.Z,{modalOpen:a,onClose:function(){l()},title:(0,g.jsx)("div",{className:t.promptTitle,children:(0,g.jsxs)("div",{children:["New ",c," Created"]})}),titleIcon:(0,g.jsx)(h.tVY,{}),children:(0,g.jsxs)(u.ZP,{container:!0,children:[(0,g.jsxs)(u.ZP,{item:!0,xs:12,className:t.formScrollable,children:["A new ",c," has been created with the following details:",!p&&d&&(0,g.jsx)(o.Fragment,{children:(0,g.jsxs)(u.ZP,{item:!0,xs:12,className:t.credentialsPanel,children:[(0,g.jsx)("div",{className:t.credentialTitle,children:"Console Credentials"}),Array.isArray(d)&&d.map((function(e,t){return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(v,{label:"Access Key",value:e.accessKey}),(0,g.jsx)(v,{label:"Secret Key",value:e.secretKey})]})})),!Array.isArray(d)&&(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(v,{label:"Access Key",value:d.accessKey}),(0,g.jsx)(v,{label:"Secret Key",value:d.secretKey})]})]})}),(null===d||void 0===d)&&(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(v,{label:"Access Key",value:n.accessKey||""}),(0,g.jsx)(v,{label:"Secret Key",value:n.secretKey||""})]}),p?(0,g.jsx)("div",{className:t.warningBlock,children:"Please Login via the configured external identity provider."}):(0,g.jsxs)("div",{className:t.warningBlock,children:[(0,g.jsx)(x.Z,{}),(0,g.jsx)("span",{children:"Write these down, as this is the only time the secret will be displayed."})]})]}),(0,g.jsx)(u.ZP,{item:!0,xs:12,className:t.buttonContainer,children:!p&&(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(j.Z,{id:"download-button",tooltip:"Download credentials in a JSON file formatted for import using mc alias import. This will only include the default login credentials.",text:"Download for import",className:t.buttonSpacer,onClick:function(){var e={};d?e=Array.isArray(d)?d.map((function(e){return{url:e.url,accessKey:e.accessKey,secretKey:e.secretKey,api:"s3v4",path:"auto"}}))[0]:{url:d.url,accessKey:d.accessKey,secretKey:d.secretKey,api:"s3v4",path:"auto"}:e={url:n.url,accessKey:n.accessKey,secretKey:n.secretKey,api:"s3v4",path:"auto"};w("credentials.json",JSON.stringify((0,r.Z)({},e)))},icon:(0,g.jsx)(h._8t,{}),variant:"contained",color:"primary"}),Array.isArray(d)&&d.length>1&&(0,g.jsx)(j.Z,{id:"download-all-button",tooltip:"Download all access credentials to a JSON file. NOTE: This file is not formatted for import using mc alias import. If you plan to import this alias from the file, please use the Download for Import button. ",text:"Download all access credentials",className:t.buttonSpacer,onClick:function(){var e={};d&&(e=d.map((function(e){return{accessKey:e.accessKey,secretKey:e.secretKey}})));w("all_credentials.json",JSON.stringify((0,r.Z)({},e)))},icon:(0,g.jsx)(h._8t,{}),variant:"contained",color:"primary"})]})})]})})}))},56028:function(e,t,n){"use strict";var r=n(29439),o=n(1413),a=n(72791),i=n(60364),l=n(13400),c=n(55646),s=n(5574),u=n(65661),d=n(39157),p=n(11135),f=n(25787),y=n(23814),m=n(81551),h=n(29823),b=n(28057),g=n(87995),v=n(80184);t.Z=(0,f.Z)((function(e){return(0,p.Z)((0,o.Z)((0,o.Z)({},y.Qw),{},{content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},y.sN))}))((function(e){var t=e.onClose,n=e.modalOpen,p=e.title,f=e.children,y=e.classes,x=e.wideLimit,j=void 0===x||x,w=e.noContentPadding,C=e.titleIcon,O=void 0===C?null:C,S=(0,m.TL)(),Z=(0,a.useState)(!1),k=(0,r.Z)(Z,2),P=k[0],D=k[1],K=(0,i.v9)((function(e){return e.system.modalSnackBar}));(0,a.useEffect)((function(){S((0,g.MK)(""))}),[S]),(0,a.useEffect)((function(){if(K){if(""===K.message)return void D(!1);"error"!==K.type&&D(!0)}}),[K]);var N=j?{classes:{paper:y.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},A="";return K&&(A=K.detailedErrorMsg,(""===K.detailedErrorMsg||K.detailedErrorMsg.length<5)&&(A=K.message)),(0,v.jsxs)(s.Z,(0,o.Z)((0,o.Z)({open:n,classes:y},N),{},{scroll:"paper",onClose:function(e,n){"backdropClick"!==n&&t()},className:y.root,children:[(0,v.jsxs)(u.Z,{className:y.title,children:[(0,v.jsxs)("div",{className:y.titleText,children:[O," ",p]}),(0,v.jsx)("div",{className:y.closeContainer,children:(0,v.jsx)(l.Z,{"aria-label":"close",id:"close",className:y.closeButton,onClick:t,disableRipple:!0,size:"small",children:(0,v.jsx)(h.Z,{})})})]}),(0,v.jsx)(b.Z,{isModal:!0}),(0,v.jsx)(c.Z,{open:P,className:y.snackBarModal,onClose:function(){D(!1),S((0,g.MK)(""))},message:A,ContentProps:{className:"".concat(y.snackBar," ").concat(K&&"error"===K.type?y.errorSnackBar:"")},autoHideDuration:K&&"error"===K.type?1e4:5e3}),(0,v.jsx)(d.Z,{className:w?"":y.content,children:f})]}))}))},76998:function(e,t,n){"use strict";var r=n(42458),o={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,a,i,l,c,s,u=!1;t||(t={}),n=t.debug||!1;try{if(i=r(),l=document.createRange(),c=document.getSelection(),(s=document.createElement("span")).textContent=e,s.style.all="unset",s.style.position="fixed",s.style.top=0,s.style.clip="rect(0, 0, 0, 0)",s.style.whiteSpace="pre",s.style.webkitUserSelect="text",s.style.MozUserSelect="text",s.style.msUserSelect="text",s.style.userSelect="text",s.addEventListener("copy",(function(r){if(r.stopPropagation(),t.format)if(r.preventDefault(),"undefined"===typeof r.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=o[t.format]||o.default;window.clipboardData.setData(a,e)}else r.clipboardData.clearData(),r.clipboardData.setData(t.format,e);t.onCopy&&(r.preventDefault(),t.onCopy(r.clipboardData))})),document.body.appendChild(s),l.selectNodeContents(s),c.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(d){n&&console.error("unable to copy using execCommand: ",d),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(d){n&&console.error("unable to copy using clipboardData: ",d),n&&console.error("falling back to prompt"),a=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(a,e)}}finally{c&&("function"==typeof c.removeRange?c.removeRange(l):c.removeAllRanges()),s&&document.body.removeChild(s),i()}return u}},568:function(e,t,n){"use strict";function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.CopyToClipboard=void 0;var o=l(n(72791)),a=l(n(76998)),i=["text","onCopy","options","children"];function l(e){return e&&e.__esModule?e:{default:e}}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){g(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},f(e,t)}function y(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=b(e);if(t){var o=b(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){if(t&&("object"===r(t)||"function"===typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return h(e)}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e){return b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},b(e)}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var v=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&f(e,t)}(c,e);var t,n,r,l=y(c);function c(){var e;d(this,c);for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return g(h(e=l.call.apply(l,[this].concat(n))),"onClick",(function(t){var n=e.props,r=n.text,i=n.onCopy,l=n.children,c=n.options,s=o.default.Children.only(l),u=(0,a.default)(r,c);i&&i(r,u),s&&s.props&&"function"===typeof s.props.onClick&&s.props.onClick(t)})),e}return t=c,(n=[{key:"render",value:function(){var e=this.props,t=(e.text,e.onCopy,e.options,e.children),n=u(e,i),r=o.default.Children.only(t);return o.default.cloneElement(r,s(s({},n),{},{onClick:this.onClick}))}}])&&p(t.prototype,n),r&&p(t,r),Object.defineProperty(t,"prototype",{writable:!1}),c}(o.default.PureComponent);t.CopyToClipboard=v,g(v,"defaultProps",{onCopy:void 0,options:void 0})},78029:function(e,t,n){"use strict";var r=n(568).CopyToClipboard;r.CopyToClipboard=r,e.exports=r},42458:function(e){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}}}]);
//# sourceMappingURL=7798.b6480ddb.chunk.js.map