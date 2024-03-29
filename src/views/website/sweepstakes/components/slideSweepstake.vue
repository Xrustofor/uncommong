<template>
  <div class="section_wrap">
    <section class="columns-2" v-if="items.organizationsCount === 1">
      <div class="col">
        <div class="line bottom_right">
          <div
            class="image"
            :style="
              items.images[0]
                ? `backgroundImage: url(${items.images[0]})`
                : {
                    backgroundSize: '80%',
                    backgroundColor: '#fff',
                    border: '1px solid #9A83B7',
                  }
            "
          />
        </div>
        <div class="line top_right">
          <div
            class="image"
            :class="items.organizations[0] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[0].image})`"
            @click="
              items.organizations[0]
                ? $router.push(`/nonprofits/${items.organizations[0].slug}`)
                : ''
            "
          />
        </div>
      </div>
      <div class="col">
        <div class="line center_left">
          <div
            class="image one"
            :style="
              items.images[1]
                ? `backgroundImage: url(${items.images[1]})`
                : {
                    backgroundSize: '80%',
                    backgroundColor: '#fff',
                    border: '1px solid #9A83B7',
                  }
            "
          />
        </div>
      </div>
    </section>

    <section class="columns-2" v-if="items.organizationsCount === 2">
      <div class="col pb-5">
        <div class="line bottom_right">
          <div
            class="image"
            :style="
              items.images[0]
                ? `backgroundImage: url(${items.images[0]})`
                : {
                    backgroundSize: '80%',
                    backgroundColor: '#fff',
                    border: '1px solid #9A83B7',
                  }
            "
          />
        </div>
        <div class="line top_right">
          <div
            class="image"
            :class="items.organizations[0] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[0].image})`"
            @click="
              items.organizations[0]
                ? $router.push(`/nonprofits/${items.organizations[0].slug}`)
                : ''
            "
          />
        </div>
      </div>
      <div class="col pt-5">
        <div class="line bottom_left">
          <div
            class="image"
            :style="
              items.images[0]
                ? `backgroundImage: url(${items.images[1]})`
                : {
                    backgroundSize: '80%',
                    backgroundColor: '#fff',
                    border: '1px solid #9A83B7',
                  }
            "
          />
        </div>
        <div class="line top_left">
          <div
            class="image"
            :class="items.organizations[1] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[1].image})`"
            @click="
              items.organizations[1]
                ? $router.push(`/nonprofits/${items.organizations[1].slug}`)
                : ''
            "
          />
        </div>
      </div>
    </section>

    <section class="columns-2" v-if="items.organizationsCount === 3">
      <div class="col">
        <div class="line bottom_right">
          <div
            class="image"
            :class="items.organizations[0] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[0].image})`"
            @click="
              items.organizations[0]
                ? $router.push(`/nonprofits/${items.organizations[0].slug}`)
                : ''
            "
          />
        </div>
        <div class="line top_right">
          <div
            class="image"
            :class="items.organizations[0] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[0].image})`"
            @click="
              items.organizations[0]
                ? $router.push(`/nonprofits/${items.organizations[1].slug}`)
                : ''
            "
          />
        </div>
      </div>
      <div class="col">
        <div class="line center_left">
          <div
            class="image one"
            :class="items.organizations[0] ? 'active' : ''"
            :style="`backgroundImage: url(${items.organizations[0].image})`"
            @click="
              items.organizations[0]
                ? $router.push(`/nonprofits/${items.organizations[2].slug}`)
                : ''
            "
          />
        </div>
      </div>
    </section>

    <section class="image_group_slide" v-if="items.organizationsCount === 4">
      <ul v-for="(items, mainIndex) in itemsGroup" :key="`items-${mainIndex}`">
        <li
          v-for="(item, index) in items"
          :key="`image-${index}`"
          class="active"
        >
          <div
            class="image"
            :style="{
              backgroundImage: `url(${item.image})`,
              backgroundSize: `100%`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
            @click="$router.push(`/nonprofits/${item.slug}`)"
          />
        </li>
      </ul>
    </section>

    <section class="image_group_slide" v-if="items.organizationsCount > 4">
      <ul v-for="(items, mainIndex) in itemsGroup" :key="`items-${mainIndex}`">
        <li
          v-for="(item, index) in items"
          :key="`image-${index}`"
          v-show="item.active || item.expected"
          :class="[
            item.active ? 'active' : '',
            item.expected ? 'expected' : '',
            item.turn ? 'turn' : '',
          ]"
        >
          <div
            class="image"
            :style="{
              backgroundImage: `url(${item.image})`,
              backgroundSize: `100%`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
            @click="$router.push(`/nonprofits/${item.slug}`)"
            @mouseleave="saveHoverLeave(item.id, mainIndex)"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Object,
      default: () => {
        return {
          organizationsCount: 0,
          images: [],
          organizations: [
            {
              id: null,
              name: "",
              image: "",
              slug: "",
              account_id: "",
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      itemsGroup: [
        [
          {
            id: null,
            name: "",
            image: "",
            slug: "",
            account_id: "",
            active: true,
          },
        ],
        [
          {
            id: null,
            name: "",
            image: "",
            slug: "",
            account_id: "",
            active: true,
          },
        ],
        [
          {
            id: null,
            name: "",
            image: "",
            slug: "",
            account_id: "",
            active: true,
          },
        ],
        [
          {
            id: null,
            name: "",
            image: "",
            slug: "",
            account_id: "",
            active: true,
          },
        ],
      ],
      selectId: null,
      queue: [],
    };
  },
  created() {
    const count = this.items.organizationsCount;
    if (count >= 4) {
      this.createItems();
    }
  },
  watch: {
    items() {
      const count = this.items.organizationsCount;
      if (count >= 4) {
        this.createItems();
      }
    },
  },

  methods: {
    saveHoverLeave(id, mainIndex) {
      let queue = this.queue;

      let result = this.itemsGroup.map((mainItem, mainKey) => {
        if (mainIndex === mainKey) {
          return mainItem.map((item, key) => {
            let data = JSON.parse(JSON.stringify(item));
            if (data.expected) {
              data.expected && delete data.expected;
              data.active = true;
              data.turn = true;
              return data;
            }

            data = JSON.parse(JSON.stringify(item));
            if (data.active) {
              data.active && delete data.active;
              data.turn && delete data.turn;
              queue.splice(0, 1);
              queue.push(item.id);
              return data;
            }
            return item;
          });
        }
        return mainItem;
      });

      result = result.map((mainItem, mainKey) => {
        return mainItem.map((item, key) => {
          const firstIdLine = queue[0];
          const candidate = this.items.organizations.find(
            (o) => o.id === firstIdLine
          );
          let data = JSON.parse(JSON.stringify(item));
          return !item.active ? { ...candidate, expected: true } : data;
        });
      });

      this.itemsGroup = result;
      this.queue = queue;
    },

    createItems() {
      const data = this.items.organizations;
      const numberVisibleImages = 4;

      const queue = [];
      this.items.organizations.map((o, key) => {
        if (key >= numberVisibleImages) {
          queue.push(o.id);
        }
      });

      this.queue = queue;

      const items = [];
      for (let i = 0; i < numberVisibleImages; i++) {
        const item = [];

        data.map((d, key) => {
          if (i === key) { 
            item.push({ ...d, active: true }) 
          };
        });

        items.push(item);
      }

      let following = data.find((d) => d.id === queue[0]);
      if (following) {
        following.expected = true;
        for (let i = 0; i < items.length; i++) {
          items[i].push(following);
        }
      }

      this.itemsGroup = items;
    },
  },
};
</script>
<style lang="scss" scoped>
.section_wrap {
  display: flex;
}
.columns-2 {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.line {
  display: flex;
  flex: 1;
  padding: 0.8rem;

  &.bottom_right {
    justify-content: flex-end;
    align-items: flex-end;
  }
  &.top_right {
    justify-content: flex-end;
    align-items: end;
  }
  &.top_left {
    justify-content: flex-start;
    align-items: end;
  }
  &.bottom_left {
    justify-content: end;
    align-items: flex-end;
  }
  &.center_left {
    justify-content: flex-start;
    align-items: center;
  }
}

.image {
  display: flex;
  max-height: 24rem;
  height: 100%;
  max-width: 29rem;
  width: 100%;
  background-image: url(../../../../assets/img/logo-blue.svg);
  background-repeat: no-repeat;
  border-radius: 1rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  margin: 0;
  transition: all 0.3s ease;
  &.one {
    max-height: 35rem;
    height: 100%;
  }
  &.active {
    cursor: pointer;
    &:hover {
      transition: all 0.3s ease;
      transform: scale(1.1);
    }
  }
}

.image_group_slide {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  ul {
    width: 50%;
    position: relative;
    display: flex;
    li {
      position: absolute;
      max-height: 24rem;
      height: 100%;
      max-width: 29rem;
      width: 100%;
      padding: 0.8rem;
      display: flex;
    }
    &:nth-child(odd) {
      bottom: 2.5rem;
    }
    &:nth-child(even) {
      top: 2.5rem;
    }
    &:nth-child(1) {
      right: 0;
      justify-content: flex-end;
      li.active,
      li.expected {
        top: auto;
        bottom: 0;
      }
    }
    &:nth-child(2) {
      li.active,
      li.expected {
        top: auto;
        bottom: 0;
      }
    }
    &:nth-child(3) {
      justify-content: flex-end;
      li.active,
      li.expected {
        top: 0;
        bottom: auto;
      }
    }
    &:nth-child(4) {
      li.active,
      li.expected {
        top: 0;
        bottom: auto;
      }
    }
  }
  .expected .image {
    opacity: 0;
    z-index: 0;
    transition: opacity 1s ease;
    transform: rotateY(90deg);
  }
  .active .image {
    z-index: 1;
    background: #fff;
  }
  li.active .image {
    border-radius: 2rem;
    overflow: hidden;
    cursor: pointer;
    transform: scale(1);
    transition: transform 0.5s ease;
    &:hover {
      transform: scale(1.1);
      transition: transform 0.5s ease;
    }
  }
  li.turn .image {
    transition: opacity 0.5s ease;
    opacity: 1;
    animation-duration: 1s;
    animation-name: slidein;
  }
}

@keyframes slidein {
  0% {
    transition: opacity 1s ease;
    opacity: 0;
    transform: rotateY(0deg);
    transform: scale(1.1);
  }
  50% {
    transition: opacity 1s ease;
    opacity: 1;
    transform: rotateY(90deg);
  }
  100% {
    transition: opacity 1s ease;
    opacity: 1;
    transform: rotateY(0deg);
    transform: scale(1);
  }
}
</style>