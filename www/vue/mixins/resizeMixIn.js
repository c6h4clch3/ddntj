/*
 * dragMixIn v1.0.0 author: @c6h4clch3
 * Vue用にドラッグで要素をリサイズさせたい時のミックスイン。
 * 使用したいコンポーネントでインポートして、
 * v-resizeをリサイズしたい要素で指定する。
 * 以下の修飾子を渡すことでリサイズ可能な方向を制御できる。
 * left: 左端からのリサイズを許可
 * right: 右端からのリサイズを許可
 * top: 上端からのリサイズを許可
 * bottom: 下端からのリサイズを許可
 * horizontal: 左右端からのリサイズを許可
 * vertical: 上下端からのリサイズを許可
 * all: 全方向の端からのリサイズを許可
 * これらの指定は半角スペースつなぎで複数使用することができる。
 * ex) v-resize.left.right <=> v-resize.horizontal
 * コンポーネントのdataでresizeBorderを上書きすることで
 * そのコンポーネントでのリサイズ可能な境界幅を指定できる。
 */
export default {
  data: function() {
    return {
      resizing: false,
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
  methods: {
    // mousedown
    resizeMixInStart(event) {
      if (event.target !== event.currentTarget || event.button !== 0) {
        return;
      }
      this.target = event.currentTarget;
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
      this.targetTop = this.target.offsetTop;
      this.targetLeft = this.target.offsetLeft;
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
      const resizeBorder = parseInt(this.target.dataset.border);
      console.log(resizeBorder);
      directions.forEach(function(direction) {
        console.log(direction);
        switch (direction) {
          case 'left':
            borderLeft += resizeBorder;
            break;
          case 'right':
            borderRight -= resizeBorder;
            break;
          case 'top':
            borderTop += resizeBorder;
            break;
          case 'bottom':
            borderBottom -= resizeBorder;
            break;
          default:
            break;
        }
      }, this);
      this.enableResizeLeft = clientMouseX < borderLeft;
      this.enableResizeRight = clientMouseX > borderRight;
      this.enableResizeTop = clientMouseY < borderTop;
      this.enableResizeBottom = clientMouseY > borderBottom;
      switch (true) {
        case this.enableResizeLeft:
        case this.enableResizeRight:
        case this.enableResizeTop:
        case this.enableResizeBottom:
          this.resizing = true;
          break;
        default:
          this.resizing = false;
          return;
          break;
      }
      this.target.style.position = 'absolute';
      this.target.style.top = this.targetTop + 'px';
      this.target.style.left = this.targetLeft + 'px';
      this.target.style.width = clientWidth + 'px';
      this.target.style.height = clientHeight + 'px';
      this.target.style.right = 'auto';
      this.target.style.bottom = 'auto';
    },
    // mousemove
    resizeMixInContinue(event) {
      if (!this.resizing) {
        return;
      }
      event.preventDefault();
      requestAnimationFrame(() => {
        const diffX = event.pageX - this.mouseX;
        const diffY = event.pageY - this.mouseY;

        switch (true) {
          case this.enableResizeLeft:
            this.target.style.left = (parseInt(this.target.style.left) + diffX) + 'px';
            this.target.style.width = (parseInt(this.target.style.width) - diffX) + 'px';
            break;
          case this.enableResizeRight:
            this.target.style.width = (parseInt(this.target.style.width) + diffX) + 'px';
            break;
          default:
            break;
        }
        switch (true) {
          case this.enableResizeTop:
            this.target.style.top = (parseInt(this.target.style.top) + diffY) + 'px';
            this.target.style.height = (parseInt(this.target.style.height) - diffY) + 'px';
            break;
          case this.enableResizeBottom:
            this.target.style.height = (parseInt(this.target.style.height) + diffY) + 'px';
            break;
          default:
            break;
        }
        this.mouseX = event.pageX;
        this.mouseY = event.pageY;
      });
    },
    // mouseup
    resizeMixInEnd(event) {
      if (!this.resizing) {
        return;
      }

      this.resizeMixInContinue(event);
      this.resizing = false;
    }
  },
  directives: {
    resize: {
      bind(el, binding, vnode) {
        const option = binding.value;
        const defaultOption = {
          border: 5,
          grid: null,
          maxHeight: null,
          maxWidth: null,
          minHeight: 10,
          minWidth: 10,
        }
        const mergedOption = Object.assign({}, defaultOption, option);
        let dataset = [];
        function push(arr, ...values) {
          values.forEach(function (value) {
            if (!this.some((elm) => {
              return elm === value;
            })) {
              this.push(value);
            }
          }, arr);
        };
        for (let direction in binding.modifiers) {
          if (!binding.modifiers.hasOwnProperty(direction)) {
            return;
          }
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
            case 'all':
              push(dataset, 'left', 'right', 'top', 'bottom');
              break;
            default:
              break;
          }
        }
        if (dataset.length === 0) {
          dataset = ['right', 'bottom'];
        }
        el.dataset.direction = dataset.join(' ');
        el.dataset.border = mergedOption.border;
        el.dataset.minHeight = mergedOption.minHeight;
        el.dataset.minWidth = mergedOption.minWidth;
        el.addEventListener('mousedown', vnode.context.resizeMixInStart);
        window.addEventListener('mousemove', vnode.context.resizeMixInContinue);
        el.addEventListener('mouseup', vnode.context.resizeMixInEnd);
      }
    }
  }
}
