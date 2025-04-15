
window.elog = (msg) => {
    let elogScroll = document.getElementById('elogscroll');
    if (elogScroll == null) {
        document.body.insertAdjacentHTML('beforeend', `
            <style>
                .elogwindow {
                    position: fixed;
                    cursor: move;
                    width:100%;
                    height:300px;
                    max-height:300px;
                    max-width:600px;
                    z-index:99;
                    opacity:0.40;
                    color:white;
                    background-color:black;
                    left: 20px;
                    bottom:20px;
                    border: 1px solid #000080;
                }
                .elogheader {
                    position: relative;
                    z-index:100;
                    top:0;
                    left:0;
                    right:0;
                    height:20px;
                    background-color:#000080;
                    padding:1px 5px;
                    font-size: 80%;
                }
                .elogscroll {
                    position: relative;
                    padding: 5px;
                    overflow-y: scroll;
                    top: 20px;
                    left:0;
                    right:0;
                    height: calc(100% - 20px);
                }
                #elogminimizebtn {
                    width: 18px;
                    height: 18px;
                    color: #000060;
                    background-color: #ddd;
                    border: 1px solid #555;
                    cursor: pointer;
                    float: right;

                }
                .elogmsg {
                }
            </style>
            <div id="elog" class="elogwindow">
                <div id="elogheader" class="elogheader">
                    <span>eConsole</span>
                    <button id="elogminimizebtn" type="button">⏷</button>
                </div>
                <div id="elogscroll" class="elogscroll">
                    <div class="elogmsg">elog:running...</div>
                </div>
            </div>`);
    }
    elogScroll = document.getElementById('elogscroll');
    if (elogScroll == null) {
        //alert("WTF");
    }
    const logMsg = `elog:${msg}.`;
    elogScroll.insertAdjacentHTML('afterbegin',
                               `<div class="elogmsg">${logMsg}</div>`);
    window?.console?.warn(logMsg);
}



















