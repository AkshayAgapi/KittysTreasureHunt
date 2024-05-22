export default class GameHTTPManager {
  private static Instance: GameHTTPManager = null;
  public static getInstance(): GameHTTPManager {
    if (this.Instance === null || this.Instance === undefined) {
      this.Instance = new GameHTTPManager();
    }
    return this.Instance;
  }

  isNullOrEmpty(text) {
    if (text == undefined || text == null || text == "") {
      return true;
    }

    return false;
  }

  sendGetHttpRequest(
    url: string,
    onSuccesCallBack: (response: any) => void,
    onErrorCallBack: (mes: string) => void
  ) {
    cc.log("sendGetHttpRequest url: " + url);

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        // cc.log("sendGetHttpRequest onreadystatechange responseText: " + xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 400) {
          // cc.log("sendGetHttpRequest onreadystatechange responseText: " + xhr.responseText);

          let response = xhr.responseText;
          onSuccesCallBack(response);
        }
      }
    }

    xhr.onerror = () => {
      let errtext = "Không thể kết nối đến máy chủ, xin hãy thử lại.";

      cc.log("sendGetHttpRequest onerror responseText: " + xhr.responseText);

      if (!this.isNullOrEmpty(xhr.responseText)) {
        let obj = null;
        try {
          obj = JSON.parse(xhr.responseText);
        } catch (error) { }

        if (
          obj !== null &&
          obj !== undefined &&
          !this.isNullOrEmpty(obj.msg)
        ) {
          errtext = obj.msg;
        }
      }
      onErrorCallBack(errtext);
    };

    xhr.ontimeout = () => {
      onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
    };

    xhr.timeout = 30000;
    xhr.open("GET", url, true);

    xhr.send();
  }


  sendGetHttpRequestNoJson(
    url: string,
    onSuccesCallBack: (response: any) => void,
    onErrorCallBack: (mes: string) => void
  ) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          let response = xhr.responseText;
          onSuccesCallBack(response);
        } else {
          onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
        }
      }
    };
    xhr.onerror = () => {
      let errtext = "Không thể kết nối đến máy chủ, xin hãy thử lại.";
      if (!this.isNullOrEmpty(xhr.responseText)) {
        let obj = null;
        try {
          obj = JSON.parse(xhr.responseText);
        } catch (error) { }

        if (
          obj !== null &&
          obj !== undefined &&
          !this.isNullOrEmpty(obj.msg)
        ) {
          errtext = obj.msg;
        }
      }
      onErrorCallBack(errtext);
    };
    xhr.ontimeout = () => {
      onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  sendGetHttpRequestWithToken(url: string, onSuccesCallBack: (response: any) => void, onErrorCallBack: (mes: string) => void) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          let response = xhr.responseText;
          onSuccesCallBack(JSON.parse(response));
        } else {
          onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
        }
      }
    };

    xhr.onerror = () => {
      let errtext = "Không thể kết nối đến máy chủ, xin hãy thử lại.";
      if (!this.isNullOrEmpty(xhr.responseText)) {
        let obj = null;
        try {
          obj = JSON.parse(xhr.responseText);
        } catch (error) { }

        if (obj !== null && obj !== undefined && !this.isNullOrEmpty(obj.msg)) {
          errtext = obj.msg;
        }
      }
      onErrorCallBack(errtext);
    };

    xhr.ontimeout = () => {
      onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
    };

    // cc.log("session_id: " + GamePlayManager.getInstance().session_id);
    // cc.log("token: " + GamePlayManager.getInstance().token);
    // xhr.setRequestHeader("X-TOKEN", GamePlayManager.getInstance().session_id);
    xhr.open("GET", url, true);
    xhr.send();
  }

  sendPostHttpRequest(
    url: string,
    body: string,
    onSuccesCallBack: (response: any) => void,
    onErrorCallBack: (mes: string) => void,
    isSetXToken = true,
    isShow400Error = false
  ) {
    let xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          // cc.log(xhr.responseText);
          let response = xhr.responseText;
          try {
            let obj = JSON.parse(response);
            onSuccesCallBack(obj);
          } catch (error) {
            cc.log("sendPostHttpRequest error: ", error);
            cc.log("sendPostHttpRequest response: " + response);
            onErrorCallBack(response);
          }
        } else {
          let errtext = "Không thể kết nối đến máy chủ, xin hãy thử lại.";
          // cc.log("asddasadsdasdasadsdas " + xhr.responseText );
          if (!this.isNullOrEmpty(xhr.responseText)) {
            //     cc.log(xhr.responseText)
            try {
              let obj = JSON.parse(xhr.responseText);
              if (obj !== null && obj !== undefined && !this.isNullOrEmpty(obj.msg)) {
                errtext = obj.msg;
              } else if (obj !== null && obj !== undefined && !this.isNullOrEmpty(obj.message)) {
                errtext = obj.message;
              }
            }
            catch (e) {
              if (isShow400Error === true && xhr.status === 400)
                errtext = xhr.responseText;
            }
          }
          onErrorCallBack(errtext);
        }
      }
    };
    xhr.onerror = () => {
      let errtext = "Không thể kết nối đến máy chủ, xin hãy thử lại.";
      cc.log(JSON.stringify(xhr.responseText));
      if (!this.isNullOrEmpty(xhr.responseText)) {
        let obj = null;
        try {
          obj = JSON.parse(xhr.responseText);
        } catch (error) { }

        if (
          obj !== null &&
          obj !== undefined &&
          !this.isNullOrEmpty(obj.msg)
        ) {
          errtext = obj.msg;
        }
      }
      onErrorCallBack(errtext);
    };
    xhr.ontimeout = () => {
      onErrorCallBack("Không thể kết nối đến máy chủ, xin hãy thử lại.");
    };

    xhr.open("POST", url, true);
    // if (!this.isNullOrEmpty(GamePlayManager.getInstance().session_id)) {
    //   if (isSetXToken === true)
    //     xhr.setRequestHeader("X-TOKEN", GamePlayManager.getInstance().session_id);
    //   xhr.setRequestHeader("Content-Type", "application/json");
    // }
    xhr.send(body);
  }
}
