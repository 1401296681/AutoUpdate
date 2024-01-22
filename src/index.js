/**
 * 自动更新
 */
let lastSrcs;

const scriptReg = /\<script.*src=["'](?<src>[^"']+)/gm;

/**
 * 获取最新脚本链接
 * @returns []
 */
async function extractNewScripts() {
  const html = await fetch("/?_timestamp=" + Date.now()).then((res) =>
    res.text()
  );

  scriptReg.lastIndex = 0;
  let result = [];
  let match;
  match = scriptReg.exec(html);
  result.push(match.groups.src);
  return result;
}

async function needUpdate() {
  const newScripts = await extractNewScripts();
  if (!lastSrcs) {
    lastSrcs = newScripts;
    return false;
  }
  let result = false;
  if (lastSrcs.length !== newScripts.length) {
    return true;
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true;
      break;
    }
  }
  lastSrcs = newScripts;
  return result;
}

export async function isShowMeg() {
  const willUpdate = await needUpdate();
  if (willUpdate) {
    ElMessageBox.confirm(`页面有更新，点击确定刷新页面🚀`, "", {
      type: "warning",
    })
      .then(() => {
        location.reload();
      })
      .catch(() => {});
  }
}

export function autoRefresh() {
  document.addEventListener("visibilitychange", () => {
    //浏览器tab标签切换事件
    if (document.visibilityState == "visible") {
      //页面切换或者最小化
      isShowMeg();
    }
  });
}
