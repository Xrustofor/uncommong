<template>
  <div class="list">
    <div class="list_title">{{ title }}</div>
    <div class="list_box" :style="{ maxHeight: `${maxHeight}vh` }">
      <template v-if="items.length">
        <div
          class="item"
          v-for="(item, index) in items"
          :key="index"
          :class="activeIdx === index ? 'active' : ''"
          :style="{ cursor: clickable ? 'pointer' : 'default' }"
          @click="$emit('action', item)"
        >
          <div class="column" :class="i.class" v-for="i in columnNames" :key="i.key">
            <p v-if="i.key == 'image'" class="item_pic">
              <span
                class="item_pic_image"
                v-if="item.profile_picture"
                :style="{ backgroundImage: `url(${item.profile_picture})` }"
              ></span>
              <span class="item_pic_name" v-else :class="{ image: !item.initials }">{{
                item.initials
              }}</span>
            </p>
            <p>{{ item[i.key] }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <slot name="emtpyList"></slot>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, default: '' },
    items: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    clickable: { type: Boolean, default: false },
    maxHeight: { type: String, default: '45' },
    activeIdx: { type: [String, Number], default: '-1' },
  },
  data() {
    return {
      columnNames: [],
    }
  },
  created() {
    const keyItems = []
    this.headers.map((h) => {
      if (h.key) {
        var el = {
          key: h.key,
          class: h.className,
        }
        keyItems.push(el)
      }
    })
    this.columnNames = keyItems
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.list {
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &_title {
    color: $violet;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
    &:empty {
      margin: 0;
    }
  }

  &_box {
    width: calc(100% + 10px);
    padding-right: 10px;
    overflow-y: auto;
    padding-top: 10px;

    .item {
      display: flex;
      align-items: center;
      height: 55px;
      width: 100%;
      border: 2px solid #e7e1ee;
      border-radius: 10px;
      padding: 0px 15px;
      margin-bottom: 10px;
      &.active {
        border: 3px solid #63517a;
        box-shadow: 0px 4px 4px rgba(99, 81, 122, 0.25);
      }
      .column {
        flex: 1;
        overflow: hidden;
        margin-right: 10px;
        &.xsmall {
          flex: 20px 0;
          margin-right: 5px;
        }
        &.small {
          flex: 25px 0;
        }
        &.medium {
          flex: 1.3;
        }
        &.right {
          p {
            text-align: right;
          }
        }
        &.center {
          p {
            text-align: center;
          }
        }
        p {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &_pic {
        span {
          height: 25px;
          width: 25px;
          background-color: #ceb8e0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &_image {
          background-size: cover;
          background-position: center;
        }
        &_name {
          font-weight: 600;
          font-size: 11px;
          &.image {
            background-image: url('~@/assets/img/default_picture.svg');
            background-size: 60%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }
  }
}
</style>
