const normal = 220;
const slow = 420;
const fast = 150;

/** react-posed transition 常用值 */
export const spring = { type: 'spring', stiffness: 120, damping: 15 };
export const springSlow = { type: 'spring', stiffness: 90, damping: 15 };
export const springFast = { type: 'spring', stiffness: 220, damping: 15 };
export const easeOut = { ease: 'easeOut', duration: normal };
export const easeOutSlow = { ease: 'easeOut', duration: slow };
export const easeOutFast = { ease: 'easeOut', duration: fast };
export const linear = { ease: 'linear', duration: normal };
export const none = { ease: 'linear', duration: 0 };
export const linearSlow = { ease: 'linear', duration: slow };
export const linearFast = { ease: 'linear', duration: fast };
export const anticipate = { ease: 'anticipate', duration: normal };
export const circIn = { ease: 'circIn', duration: normal };
export const circOut = { ease: 'circOut', duration: normal };
export const circInOut = { ease: 'circInOut', duration: normal };
export const backIn = { ease: 'backIn', duration: normal };
export const backOut = { ease: 'backOut', duration: normal };
export const backInOut = { ease: 'backInOut', duration: normal };
export const easeIn = { ease: 'easeIn', duration: normal };
export const easeInOut = { ease: 'easeInOut', duration: normal };
// 衰减, 类似ios的滚动 Snap to nearest 100px
export const decay = { type: 'decay', modifyTarget: v => Math.ceil(v / 100) * 100 };
export const physics = { type: 'physics', velocity: 1000 };

/* react-pose example

import React from 'react';
import posed, { PoseGroup } from 'react-pose';
import pt from 'src/units/posedTransitions';

const Box = posed.button({
  visible: { y: 0, transition: pt.spring },
  hidden: { y: ({ y }) => y, transition: pt.spring },
  draggable: true,
  pressable: true,
  hoverable: true,
  init: { scale: 1, padding: '0px', background: 'rgba(0,0,0,0)', fontSize: '40px', border: '3px solid rgba(0,0,0,0)' },
  drag: { padding: '20px' },
  press: { scale: 2, background: '#f00' },
  hover: { border: '3px solid #33f' },
});

const Sidebar = posed.ul({
  open: { staggerChildren: 200 },
  closed: {},
});

const Item = posed.button({
  open: { y: 0, opacity: 1, transition: pt.spring },
  closed: { y: 90, opacity: 0, transition: pt.spring },
});

const EnterBox = posed.p({
  // init: { y: 100 },
  enter: { y: 0, opacity: 1, delay: 300 },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 200 },
  },
});

function Home() {
  const [showBox, setShowBox] = React.useState(true);

  return (
    <div>
      <button type="button" onClick={() => setShowBox(!showBox)}>
        change
      </button>
      <Box pose={showBox ? 'visible' : 'hidden'} y={200} style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
        the box
      </Box>
      <PoseGroup>
        <EnterBox key="home">{showBox && <div>haha, enter</div>}</EnterBox>
      </PoseGroup>
      <Sidebar pose={showBox ? 'open' : 'closed'}>
        <Item style={{ width: 100, height: 50, backgroundColor: '#f00' }} />
        <Item style={{ width: 100, height: 50, backgroundColor: '#f55' }} />
        <Item style={{ width: 100, height: 50, backgroundColor: '#50f' }} />
        <Item style={{ width: 100, height: 50, backgroundColor: '#30a' }} />
      </Sidebar>
    </div>
  );
}

export default Home;

*/
