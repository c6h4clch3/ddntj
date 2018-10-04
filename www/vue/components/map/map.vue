<template>
  <div class="canvas"
       :style="{ width: `${rows * grid * scale}px`, height: `${columns * grid * scale}px`, 'background-image': `url(${imageUrl})` }"
       v-drag>
    <div class="grid-wrapper">
      <div class="grid-row" v-for="rn in rows" :key="rn"
           :style="{ height: `${grid * scale}px` }">
        <div class="grid" v-for="cn in columns" :key="cn"
             :style="{ width: `${grid * scale}px` }">
          <span :style="{ transform: `scale(${scale})` }">
            {{ cn }}-{{ rn }}
          </span>
        </div>
      </div>
    </div>
    <div class="character-layer">
      <div  class="character" v-drag="{ grid: grid * scale }"
            :style="{
              width: `${grid * scale}px`,
              height: `${grid * scale}px`,
              'background-image': `url(${imageUrl})`
            }"></div>
    </div>
  </div>
</template>

<script>
import dragMixIn from '../../mixins/dragMixIn';
import resizeMixIn from '../../mixins/resizeMixIn';

export default {
  data() {
    return {
      rows: 20,
      columns: 20,
      grid: 50,
      scale: 0.7,
      imageUrl: 'http://growthseed.jp/wp-content/uploads/2016/12/peach-1.jpg'
    }
  },
  mixins: [
    dragMixIn,
    resizeMixIn
  ]
}
</script>

<style lang="scss">
.canvas {
  border-top: solid 1px #000;
  border-left: solid 1px #000;
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  box-sizing: content-box;

  &:after {
    content: '';
    bottom: 0;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
  }

  .grid-wrapper {
    bottom: 0;
    box-sizing: border-box;
    left: 0;
    margin: auto;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;

    .grid-row {
      display: flex;
      width: 100%;
    }

    .grid {
      align-items: center;
      border-bottom: solid 1px #000;
      border-right: solid 1px #000;
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 12px;
      height: 100%;
      justify-content: center;

      span {
        display: block;
        text-align: center;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  .map-layer {
    bottom: 0;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: bottom;
    z-index: 0;
  }

  .character-layer {
    bottom: 0;
    box-sizing: border-box;
    left: 0;
    margin: auto;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  .character {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: solid 2px #ee0;
    border-radius: 2px;
    pointer-events: all;
  }
}
</style>
