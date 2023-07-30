import React, { useState, useEffect } from "react";
import { position, ball } from "../../common/constants";
import { throttle, getArrayRandom, delay } from "../../common/utils";
import classnames from "classnames";

import "./index.less";

/** 默认球剩余球 */
let surplusList = [];
/** 防抖 */
let throttled = null;

export const Collect = () => {
  // 底部按钮缩放
  const [btnScale, setBtnScale] = useState(false);
  // 收取完毕标识
  const [overFlag, setOverFlag] = useState(false);
  // 默认展示球
  const [ballList, setBallList] = useState([]);

  /**
   * 移除动画
   */
  const removeAnimation = () => {
    setTimeout(() => {
      setBtnScale(false);
    }, 300);
  };

  /**
   * 收取完毕标识
   */
  const onReceiveFinish = () => {
    console.log("收取完毕");
  };

  /**
   * 收取方法
   * @param {*} e Event
   */
  const _onReceivePoints = async (e) => {
    let { index = 0 } = e.target.dataset || {};
    // 更改当前球展示状态
    ballList[index].flag = true;
    setBallList(ballList);
    setBtnScale(true);

    await delay(500);
    // 收取展示球后，从剩余球中补位，然后删除一个剩余球
    if (surplusList && surplusList.length > 0) {
      ballList.splice(index, 1, surplusList[0]);
      surplusList.splice(0, 1);
      setBallList(ballList);
    }

    removeAnimation();
    // 如果展示球中的状态都为true，说明已收取完毕
    let flagLength = ballList.filter((v) => v.flag).length;
    if (flagLength === ballList.length) {
      onReceiveFinish();
      setOverFlag(true);
    }
  };

  /**
   * 底部按钮收取
   */
  const onButtonReceivePoints = () => {
    let arrIndex = [];
    if (!overFlag) {
      ballList.forEach((v, i) => {
        if (!v.flag) {
          arrIndex.push(i);
        }
      });
      let index = getArrayRandom(arrIndex, 1);
      let event = {
        target: {
          dataset: {
            index: index[0],
          },
        },
      };
      onReceivePoints(event);
    }
  };

  /**
   * 单个球收取
   * @param {*} e Event
   */
  const onReceivePoints = async (e) => {
    if (!throttled) {
      throttled = throttle(_onReceivePoints, 1000, null);
    }
    await throttled(e);
  };

  useEffect(() => {
    // 默认只取6个，剩余的存在surplusList中
    const integralList = ball.splice(0, 6);
    surplusList = ball.splice(0, ball.length);
    setBallList(integralList);
  }, []);

  return (
    <div className="c-collect">
      {/* 顶部悬浮球 */}
      <div className="c-collect-ball">
        {(ballList || []).map((item, index) => {
          return (
            <div
              className={classnames(
                "c-collect-item",
                `moving-down${index % 2 === 0 ? "1" : "2"}`,
                item.flag ? "c-collect-center" : ""
              )}
              onClick={(e) => onReceivePoints(e)}
              data-index={index}
              key={`${item}-${index + 1}`}
              style={{
                top: `${position[index].top / 100}rem`,
                left: `${position[index].left / 100}rem`,
              }}
            >
              +{item.number}
            </div>
          );
        })}
      </div>

      {/* 底部按钮 */}
      <div
        onClick={onButtonReceivePoints}
        className={classnames(
          "c-collect-button",
          btnScale ? "button-scale" : ""
        )}
      >
        {overFlag ? "收取完毕" : "领取"}
      </div>
    </div>
  );
};
