/**
 * Created by lakhassane on 21/03/2016.
 */

angular.module('app')
  .constant("config", (function () {
    var port = 0;              // Web server port
    //var host = "https://www.sen-pass.com/dgglobus/web";     // server host address
    var host = "https://www.sen-pass.com/web/app_dev.php";     // server host address
    var username = "globusWari";
    var pass = "globusWari@pass";

    var client_id = "1_enrll9xkel4c48gk8os0ck8084040g84cksw4cgk4s0coo8ow";
    var client_secret = "4iwd9yfhirs448ggo8sgws4wg00s00c4ogg0s0wwgccgkss4wo";

    var fbUrlApi = "https://www.sen-pass.com/web/app_dev.php/api/registers/"+client_secret+"/users";
    var url;
    port != 0 ?
      url = "http://" + host + ":" + port + "/web/app_dev.php" :
      url = "http://" + host + "/web/app_dev.php";

    return {
      //URL_IMAGE: "https://www.sen-pass.com/dgglobus/web",
      URL_IMAGE: "https://www.sen-pass.com/web",
      //URL_AVATAR: "https://www.sen-pass.com/dgglobus/web/uploads/Profils",
      URL_AVATAR: "https://www.sen-pass.com/web/uploads/Profils",
      URL: host,
      USERNAME: username,
      PASS: pass,
      //CLIENT_ID: "2_4ctlmjdxuyo00gks4wkcsoo0wk8k004gw0s0gwwk048g44kkoc",
      //CLIENT_SECRET: "28057l674hlwks4kkk0kogsk4cgk0ws4gw4cocko8400o40osg
      CLIENT_ID: client_id,
      CLIENT_SECRET: client_secret,
      API_GOOGLE_MAP_KEY : "AIzaSyCL_ldWkYcviM4jEwjVs1BMKVRFRchL728",
      URL_REGISTER_WITH_FACEBOOK: fbUrlApi,


    }
  })());
