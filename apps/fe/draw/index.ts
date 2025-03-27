export function initDraw(canvas:HTMLCanvasElement)
{
  let ctx=canvas.getContext("2d");

  if(!ctx)return;
  ctx.fillStyle="rgba(0,0,0)"
  ctx.fillRect(0,0,canvas.width,canvas.height)

  let startX=0,startY=0;
  let clicked=false;

  canvas.addEventListener("mousedown",(e)=>{
    clicked=true;
    startX=e.clientX;
    startY=e.clientY;
  })
  canvas.addEventListener("mouseup",(e)=>{
    clicked=false;
    console.log(startX)
    console.log(startY)
  })
  canvas.addEventListener("mousemove",(e)=>{
    if(clicked)
    { 
      let width=e.clientX-startX;
      let height=e.clientY-startY;

      ctx.clearRect(0,0,canvas.width,canvas.height)//pura clear pehle

      ctx.fillStyle="rgba(0,0,0)"

      ctx.fillRect(0,0,canvas.width,canvas.height)

      ctx.strokeStyle="rgba(255,255,255)"

      ctx.strokeRect(startX,startY,width,height)
    }

  })
}