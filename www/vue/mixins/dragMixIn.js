/*
 * dragMixIn v1.0.0 author: @c6h4clch3
 * Vue用にドラッグで要素を移動させたい時のミックスイン。
 * 必要なコンポーネントでインストールして、
 * mousedown -> dragMixInStart,
 * mousemove -> dragMixInContinue,
 * mouseup   -> dragMixInEnd
 * でイベントリスナーを登録すれば利用可能。
 * v-dragディレクティブを動かしたい要素に付与することでも利用可能。
 * 暴発制御のために対象の要素自身を掴まないとダメ。
 * (子要素とかドラッグしても動かない。)
 */
export default {
  data: function (){
    return {
      target: {},
      mouseX: 0,
      mouseY: 0,
      targetTop: 0,
      targetLeft: 0,
      dragging: false
    };
  },
  methods: {
    // mousedown
    dragMixInStart(event) {
      if (event.target !== event.currentTarget || event.button !== 0) {
        return;
      }
      this.target = event.currentTarget;
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
      this.targetTop = this.target.offsetTop;
      this.targetLeft = this.target.offsetLeft;
      if (this.resizeBorder !== undefined && this.target.dataset.direction !== undefined) {
        // 同じく@c6h4clch3作成のResizeMixinが渡されている場合
        const directions = this.target.dataset.direction.split(' ');
        const rect = this.target.getBoundingClientRect();
        const clientMouseX = this.mouseX - rect.left;
        const clientMouseY = this.mouseY - rect.top;
        const clientHeight = rect.height;
        const clientWidth = rect.width;
        let borderLeft = 0;
        let borderRight = clientWidth;
        let borderTop = 0;
        let borderBottom = clientHeight;
        directions.forEach(function(direction) {
          switch (direction) {
            case 'left':
              borderLeft += this.resizeBorder;
              break;
            case 'right':
              borderRight -= this.resizeBorder;
              break;
            case 'top':
              borderTop += this.resizeBorder;
              break;
            case 'bottom':
              borderBottom -= this.resizeBorder;
              break;
            default:
              break;
          }
        }, this);
        if ((borderLeft > clientMouseX && clientMouseX < borderRight) || (borderTop > clientMouseY && clientMouseY < borderBottom)) {
          console.log('resize');
          return;
        }
      }
      this.dragging = true;
      this.target.style.position = 'absolute';
      this.target.style.top = this.targetTop + 'px';
      this.target.style.left = this.targetLeft + 'px';
      this.target.style.right = 'auto';
      this.target.style.bottom = 'auto';
    },
    // mousemove
    dragMixInContinue(event) {
      if (!this.dragging) {
        return;
      }
      event.preventDefault();
      const diffX = event.pageX - this.mouseX;
      const diffY = event.pageY - this.mouseY;

      this.target.style.top = parseInt(this.target.style.top) + diffY + 'px';
      this.target.style.left = parseInt(this.target.style.left) + diffX + 'px';

      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
      this.targetTop = this.target.style.top;
      this.targetLeft = this.target.style.left;
    },
    // mouseup
    dragMixInEnd(event) {
      if (!this.dragging) {
        return;
      }

      this.dragMixInContinue(event);
      this.dragging = false;
    }
  },
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        el.addEventListener('mousedown', vnode.context.dragMixInStart);
        window.addEventListener('mousemove', vnode.context.dragMixInContinue);
        el.addEventListener('mouseup', vnode.context.dragMixInEnd);
      }
    }
  }
}
