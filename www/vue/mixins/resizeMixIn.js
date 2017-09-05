/*
 * dragMixIn v1.0.0 author: @c6h4clch3
 * Vue用にドラッグで要素をリサイズさせたい時のミックスイン。
 * 使用したいコンポーネントでインポートして、
 * v-resizeをリサイズしたい要素で指定する。
 * その際、v-resize="variable"やv-resize="'string'"で
 * 以下の文字列を渡すことでリサイズ可能な方向を制御できる。
 * left: 左端からのリサイズを許可
 * right: 右端からのリサイズを許可
 * top: 上端からのリサイズを許可
 * bottom: 下端からのリサイズを許可
 * horizontal: 左右端からのリサイズを許可
 * vertical: 上下端からのリサイズを許可
 * all: 全方向の端からのリサイズを許可
 * これらの指定は半角スペースつなぎで複数使用することができる。
 * ex) v-resize="'left right'" <=> v-resize="'horizontal'"
 * コンポーネントのdataでresizeBorderを上書きすることで
 * そのコンポーネントでのリサイズ可能な境界幅を指定できる。
 */
export default {
  data: function() {
    return {
      resizeBorder: 10,
      resizingHorizontal: false,
      resizingVertical: false,
      enableResizeLeft: false,
      enableResizeRight: false,
      enableResizeTop: false,
      enableResizeBottom: false,
      target: {},
      mouseX: 0,
      mouseY: 0,
      targetTop: 0,
      targetLeft: 0,
    }
  },
  directives: {
    resize: {
      bind(el, binding, vnode) {
        if (binding.value === "" || binding.value === undefined) {
          el.dataset.direction = "right bottom";
        } else if (binding.value === "all") {
          el.dataset.direction = "left right top bottom";
        } {
          const directions = binding.value.split(' ');
          let dataset = [];
          function push(arr, ...values) {
            values.forEach(function (value) {
              if (!this.some((elm) => {
                return elm === value;
              })) {
                this.push(value);
              }
            }, arr)
          }
          directions.forEach(function(direction) {
            switch (direction) {
              case 'left':
                push(dataset, 'left');
                break;
              case 'right':
                push(dataset, 'right');
                break;
              case 'top':
                push(dataset, 'top');
                break;
              case 'bottom':
                push(dataset, 'bottom');
                break;
              case 'horizontal':
                push(dataset, 'left', 'right');
                break;
              case 'vertical':
                push(dataset, 'top', 'bottom');
                break;
              default:
                break;
            }
          }, this);
        }
      },
      inserted(el, binding, vnode) {
        const rect = el.getBoundingClientRect();
        el.dataset.minWidth = rect.width;
        el.dataset.minHeight = rect.height;
        console.log('wh:', el.dataset.minWidth, el.dataset.minHeight);
      }
    }
  }
}
