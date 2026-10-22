/* Consent-first Vercel pageview integration for public one-page sites.
 * OFF unless owner explicitly enables the matching <meta> setting after usage review.
 * No custom events, names, invitation details, query parameters or interaction labels.
 */
(function(){
  'use strict';
  var config=document.querySelector('meta[name="owner-optional-analytics"]');
  if(!config||config.getAttribute('content')!=='enabled')return;
  var key=config.getAttribute('data-storage-key')||'';
  if(!/^hajihaz-[a-z0-9-]{1,55}-consent-v1$/.test(key))return;
  // Vercel tracking only for the canonical public home page: never pass query/token slugs.
  if(location.pathname!=='/'||location.search||location.hash)return;
  if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true)return;
  var choice=null;
  try{choice=localStorage.getItem(key)}catch{return}
  if(choice!=='yes'&&choice!=='no')choice=null;
  var loaded=false;
  function inject(){
    if(loaded||choice!=='yes')return;
    loaded=true;
    window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};
    var analytics=document.createElement('script');
    analytics.defer=true;
    analytics.src='/_vercel/insights/script.js';
    analytics.setAttribute('data-optional-analytics','yes');
    document.head.appendChild(analytics);
  }
  var style=document.createElement('style');
  style.textContent='.oa-consent{position:fixed;z-index:2147483000;right:12px;bottom:max(12px,env(safe-area-inset-bottom));max-width:min(340px,calc(100vw - 24px));padding:12px 14px;background:#172023f5;color:#f8f6f0;border:1px solid #b7a677;border-radius:12px;box-shadow:0 6px 30px #0006;font:13px/1.5 system-ui,sans-serif;letter-spacing:normal}.oa-consent strong{display:block;margin-bottom:7px}.oa-consent p{margin:0 0 10px}.oa-consent button{min-height:44px;border:1px solid #cab788;border-radius:8px;background:transparent;color:inherit;padding:7px 12px;margin:4px 6px 0 0;cursor:pointer;font:inherit}.oa-consent button:first-of-type{background:#d2bd88;color:#131a1a}.oa-consent button:focus-visible{outline:3px solid #fff;outline-offset:3px}.oa-consent.oa-small{padding:5px 8px;font-size:12px}.oa-consent.oa-small button{min-height:40px;margin:0}';
  document.head.appendChild(style);
  var wrap=document.createElement('aside');wrap.className='oa-consent';wrap.setAttribute('aria-label','Optional anonymous visitor analytics');document.body.appendChild(wrap);
  function node(tag,text){var el=document.createElement(tag);el.textContent=text;return el;}
  function button(text,click){var el=node('button',text);el.type='button';el.addEventListener('click',click);wrap.appendChild(el);return el;}
  function save(next){
    try{localStorage.setItem(key,next)}catch{return}
    var previous=choice;choice=next;render();
    if(next==='no'&&previous==='yes')location.reload();
    if(next==='yes')inject();
  }
  function render(open){
    wrap.replaceChildren();wrap.className='oa-consent';
    if(choice===null||open){
      wrap.appendChild(node('strong','Optional visitor analytics'));
      wrap.appendChild(node('p','May we count anonymous visits to this public page? We do not track names, invitation content, messages or clicks. You can withdraw anytime.'));
      button('Allow analytics',function(){save('yes')});
      button('No thanks',function(){save('no')});
    }else{
      wrap.className+=' oa-small';
      button('Privacy settings',function(){render(true)});
    }
  }
  render(false);inject();
})();
