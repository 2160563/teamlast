
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(console.log)
    .catch(console.error);
}
const CACHE_NAME = "cache-v1";
const assetToCache = [
  "/",
    "/home",
    "/tournaments",
    "/history2",
    "/register",
    "/login",
    "/client",
    "/login_tournaments",
    "/results",
    "/history",
    "/userProfile",
    "/editProfile",
    "/bracket",
    "/jquery.gracket.js",
    "/main.js",
    "/register",
    "/registerTea",
    "/manifest.json",
    "/assets/img/logo.png",
    "/assets/img/slides/nivo/1.png",
    "/assets/img/slides/nivo/2.png",
    "/assets/img/slides/nivo/3.png",
    "/assets/img/slides/nivo/4.png",
    "/assets/img/slides/nivo/5.png",
    "/assets/img/slides/nivo/6.png",
    "/assets/img/slides/nivo/7.png",
    "/assets/color/success.css",
    "/assets/css/bootstrap.css",
    "/assets/css/bootstrap-responsive.css",
    "/assets/css/boxtile.css",
    "/assets/css/camera.css",
    "/assets/css/docs.css",
    "/assets/css/flexslider.css",
    "/assets/css/nivo-slider.css",
    "/assets/css/overwrite.css",
    "/assets/css/prettyPhoto.css",
    "/assets/css/style.css",
    "/assets/ico/apple-touch-icon-57-precomposed.png",
    "/assets/ico/apple-touch-icon-72-precomposed.png",
    "/assets/ico/apple-touch-icon-114-precomposed.png",
    "/assets/ico/apple-touch-icon-144-precomposed.png",
    "/assets/ico/favicon.ico",
    "/assets/img/lol.png",
    "/assets/img/dota-2.png",
    "/assets/img/t1.png",
    "/assets/img/t2.png",
    "/assets/img/t3.png",
    "/assets/img/t4.png",
    "/assets/js/application.js",
    "/assets/js/bootstrap.js",
    "/assets/js/custom.js",
    "/assets/js/jquery.contenthover.js",
    "/assets/js/jquery.easing.1.3.js",
    "/assets/js/jquery.elastislide.js",
    "/assets/js/jquery.flexslider.js",
    "/assets/js/jquery.prettyPhoto.js",
    "/assets/js/jquery.tweet.js",
    "/assets/js/jquery-1.8.2.min.js",
    "/assets/js/modernizr.js",
    "/assets/js/nivo/jquery.nivo.slider.js",
    "/assets/js/nivo/setting.js",
    "/assets/js/camera/setting.js",
    "/assets/js/camera/camera.min.js",
    "/assets/js/camera/jquery.mobile.customized.min.js",
    "/assets/js/hover/jquery-hover-effect.js",
    "/assets/js/hover/setting.js",
    "/assets/js/google-code-prettify/prettify.js",
    "/assets/js/google-code-prettify/prettify.css",
    "/assets/js/portfolio/jquery.quicksand.js",
    "/assets/js/portfolio/settings.js"
];
self.addEventListener("install", function(event) {
  console.log("installing");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(assetToCache);
      })
      .catch(console.error)
  );
});
self.addEventListener('fetch', function(event) {
 console.log(event.request.url);
});
self.addEventListener('push', event => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.message,
  });

});

