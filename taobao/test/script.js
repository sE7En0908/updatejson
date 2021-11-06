// 爱吃鱼的九条
      const web = new WebView()


      await web.loadURL("https://login.m.taobao.com/login.htm?redirectURL=https%3A%2F%2Fhome.m.taobao.com%2F")

      let runNum = 0

      let isNext = true;
      
      let ce = 1;


      await web.waitForLoad()

      await web.present(true)




      async function getUrl () {

        let getTkjs = '(function () {\n\n    function getCookie(name){\n      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");\n\n      if(arr=document.cookie.match(reg))\n\n        return unescape(arr[2]);\n      else\n        return null;\n    }\n\n    var c = getCookie("_m_h5_tk");\n\n    return c;\n\n  } )()'


        let tk = await web.evaluateJavaScript(getTkjs, false)

        let req = new Request(`https://service-7wsy5jm7-1257225808.sh.apigw.tencentcs.com/release/getUrl?t=${tk}`)


        let data = await req.loadJSON()

        return data.url
      }


      async function getTaskData () {
        let Furl = await getUrl()

        let taskreq = new Request(Furl)

        taskreq.timeoutInterval = 5

        taskreq.headers = {
          referer: "https://main.m.taobao.com/"
        }

        await web.loadRequest(taskreq)

        let getDatjs = `
    (function () {
      console.log(document)
    let t = document.getElementsByTagName('body')[0].innerText;

console.log(t)
    })()
    `



        let str = await web.getHTML()


        str.match(/\^+(?=<)/g);
        let result=str.match(/[^>]+(?=<)/g);
        result=result?result.join(","):"";

        return result
      }




      async function next(){

        notification('此账号的了')
        var alert
          = new Alert()

        var alert2 = new Alert()

        alert.title= "请仔细阅读"

        alert.message = "由于活动任务不做\n--------------------\n不会出新的任务\n---------------------\n所以需要手动把那个游戏任务完成之后点继续\n--------------------------"

        alert.addAction("继续做剩余任务")
        alert.addAction("剩下我要手动")


        alert2.addAction("去把互动任务做了")
        alert2.addAction("剩下的我要手动")

        const res2 = await alert2.presentAlert()
        if(res2 === 0){

          Safari.open("taobao://pages.tmall.com/wow/z/hdwk/20211111/pk20211111")

        }else{
          console.log('next end')
          return
        }


        const res = await alert.presentAlert()
        if(res === 0 ){
          //
          isNext = false
          return await run()
        }else{
          //
          console.log('next end')
          return
        }
      }


      async function run () {

       

        let data = await getTaskData()




// 处理data

        data = JSON.parse(data)


        if (data.ret && data.ret[0] == "SUCCESS::调用成功" && data.data?.model) {

          if(runNum===0){notification("任务开始了")}
          out = {
            s:"wanchenglllllllll",
            type:"script",
            runnum:runNum,
            items:[]
          }
          for (const item of data.data?.model) {
            if (item.progress.needTimes !== '0') {
              let num = item.progress.needTimes * 1
              let deliveryId = item.taskParams.deliveryId
              let implId = item.taskParams.implId
              let fromToken = item.taskParams.fromToken
              if (deliveryId != '18735' && deliveryId != '18734'){

                out.items.push(`${deliveryId}@${implId}@${ fromToken}@${num}`)
              }


            }
          }

          if (out.items.length === 0  ){

            //停止通知
            if(!isNext || runNum === 0){
              console.log('打开 tb end')
              Safari.open("shortcuts://run-shortcut?name=%E5%8F%8C%E5%8D%81%E4%B8%80%E5%96%B5%E7%B3%96%E7%99%BB%E5%BD%95%E7%89%88&input=text&text=end")
              return
            }
            
            await next();

          }

          if ( runNum > 10){
            //停止通知
            notification('此账号的任务结束了')
            return

          }
          const oj = JSON.stringify(out)



          const scheme = "shortcuts://x-callback-url/run-shortcut"


// 拼链接
          const urlScheme = new CallbackURL(scheme)

          urlScheme.addParameter("name", "双十一喵糖登录版")
          urlScheme.addParameter("input", "text")
          urlScheme.addParameter("text", oj)



          try {
            const res = await urlScheme.open()
            
          }catch (e) {
            console.log(e.message);
            let msg = e.message;
            if (e.message.search('returned to Scriptable')!== -1){
  
              ce=1
              const alert = new Alert();
              alert.title = "请勿中途打开Scriptable,会导致任务做不全"

              await alert.presentAlert();

            }else {
              
              if(ce === 0){
              
                
                return
              
            }
              if(ce == 1){
              
                ce = 0
              }
              
              
            }

          }
          runNum ++
          return await run();


        }else {
          
          console.log('过期了')
          notification('登录过期了，请重新运行登录试一试')
        }

      }

      function notification (title) {
        console.log(title)
        let n = new Notification()
        n.title = title
        n.schedule()
      }


      await run()