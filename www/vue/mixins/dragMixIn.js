/*
 * dragMixIn v1.0.0 author: @c6h4clch3
 * Vue用にドラッグで要素を移動させたい時のミックスイン。
 * 必要なコンポーネントでインストールして、
 * mousedown -> dragMixInStart,
 * mousemove -> dragMixInContinue,
 * mouseup   -> dragMixInEnd
 * でイベントリスナーを登録すれば利用可能。
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
      if (event.target !== event.currentTarget || event.buttons !== 1) {
        return;
      }
      this.target = event.currentTarget;
      this.dragging = true;
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
      this.targetTop = this.target.offsetTop;
      this.targetLeft = this.target.offsetLeft;
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
  }
}
