(function () {
    var tagId = 'G-EV1TTW5D3H';
    
    // スクリプトの動的読み込み
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId;
    document.head.appendChild(script);

    // dataLayer と gtag の初期化
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', tagId);
})();
