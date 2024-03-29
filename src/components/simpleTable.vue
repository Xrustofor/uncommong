<template>
  <section>
    <div class="pagination_overlay">
      <div class="left_part"><slot name="title"></slot></div>
      <slot name="filters"></slot>
      <div class="right_part">
        <div>SHOWING {{ items.length }} OF {{ countPages }}</div>
        <div class="select_count">
          <simpleSelect
            v-model="selectCount"
            label="ROWS PER PAGE:"
            :items="rowsPerPage"
            :height="25"
          />
        </div>
        <simplePagination
          class="pagination"
          :pages="pages"
          @paginationChange="pageChange"
        />
      </div>
    </div>
    <div
      style="position: relative"
      :style="{ marginTop: tabsН ? '20px' : '0px' }"
    >
      <div class="tabs" v-if="tabsН">
        <div
          class="tab"
          v-for="tab in tabsН"
          :key="tab.key"
          :class="[{ 'tab--active': tab.isActive }]"
          @click="$emit('toggleTab', tab.key)"
        >
          {{ tab.title }}
        </div>
      </div>
      <div class="table_overlay">
        <h4 class="title">{{ title }}</h4>
        <div
          ref="tableWrap"
          class="table_wrap"
          :style="{
            minHeight: `${wrapHeight}px`,
            paddingBottom: `${tableWrapPadding}px`,
          }"
          @mousedown="
            isDown = true
            mousedown($event)
          "
          @mouseleave="isDown = false"
          @mouseup="isDown = false"
          @mousemove="mousemove($event)"
        >
          <div class="table">
            <header>
              <div
                class="col"
                v-for="(item, key) in headerItems"
                :key="`header-${key}`"
                :class="item.className ? item.className : item.image ? 'image' : ''"
              >
                <div v-show="item.checkbox" class="checkbox_wrap">
                  <simpleCheckbox
                    class="square"
                    :checked="checkboxSelectAll"
                    v-model="selectAll"
                  />
                  <span class="layer" @click="eventSelectAll()"></span>
                </div>

                <div
                  class="button_col"
                  :class="item.icon ? `visua` : ''"
                  @click="item.action ? selectActions(item.key) : ''"
                >
                  <p>{{ item.value }}</p>
                  <span class="icon">
                    <icon-base
                      v-if="item.icon"
                      width="12"
                      height="12"
                      icon-name="elevator"
                      icon-color="#A098AB"
                      ><icon-elevator />
                    </icon-base>
                  </span>
                  <ul
                    class="dropdowns"
                    :class="hidden"
                    v-if="item.menu && item.menuKey === 'checkbox'"
                    ref="headerMenu"
                  >
                    <li
                      class="main_li"
                      v-for="(data, key) in item.menu"
                      :key="`menu-data-${key}`"
                    >
                      <div v-if="data.title" class="line" />
                      <p class="title" v-if="data.title">{{ data.title }}</p>
                      <ul>
                        <li
                          class="list"
                          v-for="(element, index) in data.items"
                          :key="`menu-item-${index}`"
                        >
                          <div class="checkbox_wrap">
                            <simpleCheckbox
                              class="checkbox_menu"
                              :label="element.value"
                              :checked="element.checked"
                            />
                            <span
                              class="layer"
                              @click.stop="
                                selectMenu(
                                  element.key,
                                  (name = item ? item.key : ''),
                                  (mainId = key),
                                  (childId = index)
                                )
                              "
                            />
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </header>
            <div class="loading_position">
              <slot name="loader"></slot>
            </div>
            <div v-if="localItems.length" ref="overlay">
              <div class="row" v-for="(item, key) in localItems" :key="`row-${key}`">
                <div
                  class="row_header"
                  :class="{
                    open: item.open,
                    accordion: accordion && item.accordionElements.length,
                  }"
                >
                  <div
                    class="col"
                    v-for="(el, index) in columnNames"
                    :key="`header-${index}`"
                    :class="el.class ? el.class : el.image ? 'image' : ''"
                  >
                    <ActionPopUp
                      v-if="el.key == 'actions_variables' || el.key == 'view'"
                      :hidden="item.actionsHidden"
                      :class="el.key == 'view' ? 'left' : 'right'"
                      :dotsClass="`dots_vertical ${item.actionsHidden ? 'disabled' : ''}`"
                      :items="item[el.key]"
                      :simpleView="!el.viewActions"
                      :viewItemHidden="item.viewItemHidden"
                      @action="
                        $emit('actionWithElement', {
                          key: $event,
                          el: item,
                        })
                      "
                      @viewItem="$emit('viewItem', item)"
                    >
                      <icon-base
                        class="icon"
                        width="16"
                        height="16"
                        viewBox="-4 -1 16 16"
                        icon-name="edit"
                        icon-color="#63517A"
                      >
                        <icon-right />
                      </icon-base>
                    </ActionPopUp>
                    <donationProgress
                      v-else-if="el.progress"
                      :raised="item.progress.amount || 0"
                      :goal="item.progress.goal || 0"
                      class="revers violet-content"
                      :style="{ width: '180px' }"
                    ></donationProgress>

                    <button
                      v-else-if="el.key === 'download'"
                      @click="$emit('getDownload', item.id)"
                    >
                      <icon-base
                        class="icon"
                        width="17"
                        height="17"
                        viewBox="0 0 8 9"
                        icon-name="download"
                        icon-color="#63517A"
                      >
                        <icon-download />
                      </icon-base>
                    </button>
                    <button
                      v-else-if="el.key === 'edit'"
                      @click="$emit('editItem', item)"
                      :disabled="!canEdit"
                    >
                      <icon-base
                        class="icon"
                        width="15"
                        height="15"
                        icon-name="edit"
                        :icon-color="canEdit ? '#63517A' : '#A098AB'"
                      >
                        <icon-edit />
                      </icon-base>
                    </button>
                    <AccordionButton
                      v-else-if="el.key === 'accordion'"
                      :disabled="!item.accordionElements.length"
                      @clickBtn="item.open = !item.open"
                    />
                    <p v-else>
                      <template v-if="el.key === positionCheckbox">
                        <div class="checkbox_wrap">
                          <simpleCheckbox
                            :id="item.id"
                            :label="item[el.key]"
                            :checked="item.checked"
                          />
                          <span class="layer" @click="$emit('selectRow', item)"></span>
                        </div>
                      </template>
                      <span v-else-if="el.image" class="image">
                        <span
                          v-if="item.image"
                          :style="{
                            backgroundImage: `url(${item.image})`,
                          }"
                        ></span>
                        <span class="name" v-else-if="!el.defaultImage">{{ item.initials }}</span>
                        <span
                          v-else
                          class="center"
                          :style="{
                            backgroundImage:
                              'url(' + require(`@/assets/img/default_picture.svg`) + ')',
                          }"
                        ></span>
                      </span>
                      <template v-else-if="el.status">
                        <span class="status" :class="item[el.key]">
                          {{ item[el.key] }}
                        </span>
                      </template>
                      <template v-else-if="el.statuses">
                        <span
                          class="status"
                          v-for="(i, key) in item[el.key]"
                          :key="key"
                          :class="i.slug"
                        >
                          {{ i.name }}
                        </span></template
                      >
                      <span v-else-if="el.booleanType">
                        {{ item[el.key] ? 'Yes' : 'No' }}
                      </span>
                      <span v-else class="only-text">{{ item[el.key] }}</span>
                    </p>
                    <template v-if="el.button && item[el.key]">
                      <button
                        :class="`button_col_simple ${el.button.primary.color}`"
                        v-if="el.button.primary"
                        @click="$emit('clickButton', { key: el.key, value: item })"
                      >
                        {{ el.button.primary.text }}
                      </button>
                    </template>
                  </div>
                </div>
                <AccordionPart
                  :className="item.open"
                  v-if="item.accordionElements"
                  :columnNames="columnNames"
                  :accordionContent="item.accordionElements"
                />
              </div>
            </div>
            <div class="item_empty" v-else>
              <h4>NO DATA</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import IconBase from '@/components/IconBase';
import iconDownload from '@/components/icons/iconDownload';
import iconEdit from '@/components/icons/iconEdit';
import iconRight from '@/components/icons/iconRight';
import iconElevator from '@/components/icons/iconElevator';
import simpleCheckbox from '@/components/inputs/simpleCheckbox';
import simpleSelect from '@/components/inputs/simpleSelect';
import simplePagination from '@/components/simplePagination';
import AccordionPart from './tableElements/accordionPart.vue';
import AccordionButton from './tableElements/accordionButton.vue';
import ActionPopUp from '@/components/actionPopUp.vue';
import donationProgress from '@/components/donationProgress';
export default {
  props: {
    title: { type: String, require: false },
    canEdit: { type: Boolean, default: true, require: false },
    headerItems: Array,
    items: Array,
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    countPages: { type: Number, default: 1 },
    numberPages: { type: Number, default: 1 },
    loader: Boolean,
    checkboxSelectAll: { type: Boolean, default: false },
    loaderButton: { type: Boolean, default: false },
    rowsPerPage: {
      type: Array,
      default: function () {
        return [10, 25, 50, 'All']
      },
    },
    accordion: { type: Boolean, default: false },
    tabsН: { type: Array, required: false },
    tableWrapPadding: { type: String, default: '20' },
    wrapHeight: { type: [String, Number], default: '350' },
  },
  components: {
    IconBase,
    iconDownload,
    iconEdit,
    iconRight,
    iconElevator,
    simpleCheckbox,
    simpleSelect,
    simplePagination,
    AccordionPart,
    AccordionButton,
    ActionPopUp,
    donationProgress,
  },
  data: () => ({
    loading: false,
    columnNames: [],
    positionCheckbox: '',
    selectCount: 10,
    selectAll: false,
    localItems: [],
    itemsId: [],
    isDown: false,
    startX: null,
    scrollLeft: null,
  }),
  created() {
    const keyItems = []
    this.headerItems.map((h) => {
      if (h.key) {
        var el = {
          key: h.key,
          class: h.className,
          type: h.key == 'button' ? h.buttonType : 'simple',
          image: h.image || false,
          defaultImage: h.defaultImage || false,
          accordion: h.accordion || false,
          booleanType: h.booleanType || false,
          viewActions: h.viewActions || false,
          actionsHidden: h.actionsHidden || false,
          progress: h.progress ? h.progress : false,
          status: h.status ? h.status : false,
          statuses: h.statuses ? h.statuses : false,
        }
        if (h.button) {
          el.button = h.button;
        }
        keyItems.push(el);
      }
      if (h.checkbox) {
        this.positionCheckbox = h.key;
      }
    })
    this.columnNames = keyItems

    this.localItems = this.items.map((el) => {
      return (el = {
        ...el,
        open: false,
      })
    })
  },
  watch: {
    loaderButton() {
      this.loading = this.loaderButton;
    },
    selectCount(val) {
      const item = typeof val === 'string' ? val.toLowerCase() : val

      this.$emit('selectCount', item);
      this.$emit('clear');
    },

    items(val) {
      this.localItems = val.map((el) => {
        return (el = {
          ...el,
          open: false,
        })
      })
    },
  },
  computed: {
    pages() {
      const count = this.numberPages;
      const items = [];
      for (let i = 0; i < count; i++) {
        items.push(i + 1);
      }

      return items;
    },

    hidden() {
      return this.loader ? 'hidden' : '';
    },
  },
  methods: {
    clickRow(item) {
      if (this.accordion) {
        item.open = !item.open;
      }
    },
    pageChange(val) {
      this.$emit('pageSelection', val);
      this.$emit('clear');
    },

    selectActions(key) {
      this.$emit('selectActions', key);
      this.$emit('clear');
    },

    selectMenu(key, name, mainId, childId) {
      const data = { key, name, mainId, childId }
      this.$emit('selectMenu', data);

      this.$emit('clear');
    },
    eventSelectAll() {
      this.$emit('selectAll', !this.checkboxSelectAll);
    },
    mousedown(e) {
      let slider = this.$refs.tableWrap;
      this.startX = e.pageX - slider.offsetLeft;
      this.scrollLeft = slider.scrollLeft;
    },
    mousemove(e) {
      let slider = this.$refs.tableWrap
      if (!this.isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - this.startX) * 3; //scroll-fast
      slider.scrollLeft = this.scrollLeft - walk;
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
@mixin color($color1) {
  color: $color1;
  background: rgba($color: $color1, $alpha: 0.2);
  border-color: rgba($color: $color1, $alpha: 0.5);
}
section {
  flex: 1;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}
.table_overlay {
  padding: 10px 20px 20px;
  border: 1px solid #f2eef9;
  border-radius: 10px;
  flex: 1;
  .title {
    color: $settingsVioletText;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 15px 0 10px;
    width: 100%;
    border-bottom: 1px solid $violetBorder;
    margin-bottom: 15px;
    &:empty {
      padding: 0;
      margin: 0;
      border-bottom: none;
    }
  }
}
.table_wrap {
  display: flex;
  overflow-x: auto;
  position: relative;
}
.table {
  position: relative;
  margin-bottom: 0;
  overflow: initial;
  padding: 0;
  flex: 1;
  p {
    font-size: 14px;
    margin-bottom: 0;
    font-weight: 400;
    cursor: default;
  }
  header {
    .col.icon_cell::before,
    .col.icon_cell::after {
      display: none;
    }
    p {
      color: $disabledColor;
    }
  }
  .loading_position {
    position: relative;
    z-index: 1;
    margin: 0 10px;
    margin-bottom: 1px;
  }

  .checkbox_wrap {
    position: relative;

    display: block;
    .layer {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  }

  header,
  .row_header {
    display: flex;
    min-width: 100%;
  }
  .row_header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    transition: all 0.2s;
    &:hover,
    &.open {
      transition: all 0.2s;
      background: #f9f8fb;
    }
    p {
      color: $violet;
      span.accordion {
        cursor: pointer;
        .icon {
          svg {
            transform: rotate(-90deg);
          }
        }
        &.open {
          .icon {
            svg {
              transform: rotate(-270deg);
            }
          }
        }
      }
      span.status {
        display: inline-block;
        font-size: 12px;
        font-weight: 500;
        padding: 4px 8px;
        border: 1px solid transparent;
        border-radius: 20px;
        color: $violet;
        text-transform: capitalize;
        margin: 2px 10px 2px 0;
        &.accepted,
        &.active {
          @include color(#71b078);
        }
        &.declined,
        &.inactive,
        &.paused {
          @include color(#d3584b);
        }
        &.pending,
        &.scheduled {
          @include color(#edbc33);
        }

        &.winner_notified {
          @include color(#6db5d1);
          &:hover {
            @include color(#588fa5);
          }
        }
        &.draft {
          @include color(#9a83b7);
          &:hover {
            @include color(#7d5ea3);
          }
        }
        &.completed,
        &.complete {
          @include color(#315b9c);
          &:hover {
            @include color(#1d4685);
          }
        }
      }
    }
    .col {
      min-height: 55px;
      &:first-of-type {
        &.small {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(-50%, -50%);
            height: 40px;
            width: 1px;
            background-color: $violetBorder;
          }
        }
      }
      &.strong p {
        font-weight: 600;
      }
    }
  }
  .col {
    display: flex;
    align-items: center;
    position: relative;
    padding: 2.5px 15px;
    flex: 1;
    min-width: 200px;
    box-sizing: content-box;
    &.capitalize {
      p {
        text-transform: capitalize;
      }
    }
    & > div {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &.small {
      position: relative;
      min-width: 25px;
      max-width: 25px;
      flex: 0.4;
    }
    &.center {
      justify-content: center;
    }
    &.medium {
      position: relative;
      min-width: 40px;
      max-width: 40px;
      flex: 0.5;
    }
    &.image {
      min-width: 50px;
      max-width: 50px;
      flex: 0.4;
      padding: 10px 0 10px 10px;
      margin-right: -5px;
      .image {
        span {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: $violetBorder;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          &.name {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          &.center {
            background-size: 25px;
          }
        }
      }
    }

    .button_col {
      cursor: auto;
      display: flex;
      align-items: center;
    }
    .button_col.visua {
      transition: all 0.2s;
      cursor: pointer;
      &:hover {
        transition: all 0.2s;
        color: #9a83b7;
        .dropdowns {
          display: block;
          transition: all 0.3s;
          &.hidden {
            display: none;
          }
        }
      }
    }
    .dropdowns {
      max-height: 260px;
      overflow-y: auto;
      position: absolute;
      bottom: 3px;
      transform: translateY(100%);
      left: 5px;
      right: 0;
      z-index: 2;
      background: #ffffff;
      box-shadow: 0px 10px 70px rgba(154, 131, 183, 0.2);
      border-radius: 10px;
      font-size: 10px;
      font-family: Inter;
      display: none;
      padding: 8px 0;
      transition: all 0.3s;
      .line {
        margin: 0 16px;
      }
      .main_li {
        padding-bottom: 8px;
        &:last-child {
          padding-bottom: 0px;
        }
      }
      .title {
        padding: 8px 16px;
        color: #63517a;
        font-weight: 900;
      }
      .list {
        display: flex;
        transition: all 0.2s;
        padding: 8px 16px;
        &:hover {
          cursor: pointer;
          transition: all 0.2s;
          background: #f9f8fb;
        }
        a {
          cursor: pointer;
        }
      }
      .checkbox_menu {
        position: relative;
        display: flex;
        justify-content: flex-end;
      }

      &.text {
        .list {
          span {
            display: inline-block;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 8px;
            border: 1px solid transparent;
            border-radius: 20px;
            cursor: pointer;
            color: $violet;
            &.active {
              @include color(#71b078);
              &:hover {
                @include color(#5f9465);
              }
            }
            &.winner_notified {
              @include color(#6db5d1);
              &:hover {
                @include color(#588fa5);
              }
            }
            &.inactive,
            &.paused {
              @include color(#d3584b);
              &:hover {
                @include color(#ac4438);
              }
            }
            &.scheduled {
              @include color(#edbc33);
              &:hover {
                @include color(#dfa507);
              }
            }
            &.draft {
              @include color(#9a83b7);
              &:hover {
                @include color(#7d5ea3);
              }
            }
            &.completed,
            &.complete {
              @include color(#315b9c);
              &:hover {
                @include color(#1d4685);
              }
            }
          }
        }
      }
    }
    .icon {
      margin-top: 2px;
      padding-left: 5px;
    }
    &.icon_cell {
      position: relative;
      min-width: 70px;
      max-width: 70px;
      flex: 0.5;
      padding: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.diver-left {
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          height: 40px;
          width: 1px;
          background: #f2eef9;
        }
      }
      &.diver-right {
        margin-right: 15px;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(-50%, -50%);
          height: 40px;
          width: 1px;
          background: #f2eef9;
        }
      }
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 20px;
        width: 25px;
        .icon {
          margin: 0;
          padding: 0;
        }
      }
    }
    &:last-child {
      padding-right: 0;
    }
  }
  header {
    .col {
      &:last-child.remove {
        padding: 0 40px 0 0;
      }
    }
  }
  .row {
    border: 1px solid #f2eef9;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .row:last-child {
    margin-bottom: 0px;
  }

  .square {
    width: auto;
  }
  .item_empty {
    text-align: center;
    border-radius: 10px;
    border: 1px solid #f2eff8;
    padding: 15px;
    h4 {
      width: 100%;
      color: #63517a;
      font-size: 15px;
      text-transform: uppercase;
      font-weight: 600;
      text-align: center;
      padding: 5px;
      cursor: default;
    }
  }
}

.pagination_overlay {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px 25px;
  @media only screen and (max-width: 1399px) {
    padding: 0 0 25px;
  }
  .left_part {
    display: flex;
    align-items: center;
    padding: 5px 0;
    &:empty {
      padding: 0;
    }
  }
  .right_part {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 5px 0;
    flex: 1;
    @media only screen and (max-width: 599px) {
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
    }
    &:first-child {
      font-size: 12px;
      color: $disabledColor;
      padding-right: 24px;
      @media only screen and (max-width: 599px) {
        margin-right: 20px;
      }
    }
  }
}
.select_count {
  margin-left: 24px;
  margin-right: 24px;
  @media only screen and (max-width: 599px) {
    margin: 5px 0;
  }
}
.select_count,
.pagination {
  padding: 5px 0;
}
.button_col_simple {
  padding: 5px 10px;
  border-radius: 28px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  opacity: 0.7;
  transition: all linear 0.3s;
  margin: 0 10px;
  &:hover {
    opacity: 1;
    transition: all linear 0.3s;
  }
  &.yellow {
    background: #edbc33;
  }
}

.tabs {
  position: absolute;
  top: 0;
  transform: translate(0, -100%);
  display: flex;
  min-width: 350px;
  .tab {
    flex-grow: 1;
    padding: 7px 15px;
    text-align: center;
    border-radius: 20px 20px 0px 0px;
    border: 1px solid #c4c4c4;
    background-color: $white;
    font-weight: 800;
    font-size: 20px;
    line-height: 1.2;
    color: $violet;
    cursor: pointer;
  }
  .tab--active {
    background-color: $violet;
    color: $white;
  }

  @media (max-width: $md) {
    .tab {
      font-size: $fs3;
      line-height: $lh3;
    }
  }
}

.only-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
