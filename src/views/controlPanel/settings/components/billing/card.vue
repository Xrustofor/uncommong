<template>
  <div>
    <div class="card" :class="type !== 'card' ? 'bank' : ''">
      <div class="card__content">
        <div class="card__content_header">
          <div class="icon" v-if="type === 'card'">
            <img
              :src="require(`@/assets/img/visa.svg`)"
              alt="visa"
              v-if="item.card.brand === 'visa'"
            />
            <img
              :src="require(`@/assets/img/mastercard.svg`)"
              alt="mastercard"
              v-if="item.card.brand === 'mastercard'"
            />
          </div>
          <div class="icon" v-else>
            <p>{{ item.bank_name }}</p>
          </div>
          <div class="actions">
            <span @click="editItem(item, item.id === defaultId)">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M16.0421 16.7368C16.0421 17.5368 15.3895 18.1474 14.6105 18.1474H3.28421C2.48421 18.1474 1.85263 17.5158 1.85263 16.7368V5.36842C1.85263 4.58947 2.50526 3.95789 3.28421 3.95789H9.07368L10.9053 2.12632H3.28421C1.47368 2.12632 0 3.57895 0 5.36842V16.7368C0 18.5474 1.47368 20 3.28421 20H14.6316C16.4421 20 17.9158 18.5474 17.9158 16.7368V9.09474L16.0842 10.9263V16.7368H16.0421Z"
                  fill="#6DB5D1"
                />
                <path
                  d="M19.5789 2.98947L17.0105 0.442105C16.7368 0.168421 16.3579 0 15.9789 0C15.5789 0 15.2211 0.147368 14.9474 0.421053L5.47368 9.89474C5.22105 10.1474 5.07368 10.4842 5.05263 10.8421L4.88421 13.5579C4.86316 13.9789 5.01053 14.4 5.30526 14.6947C5.57895 14.9684 5.95789 15.1158 6.33684 15.1158C6.35789 15.1158 6.4 15.1158 6.42105 15.1158L9.15789 14.9474C9.51579 14.9263 9.85263 14.7789 10.1053 14.5263L19.5579 5.07368C19.8316 4.8 19.9789 4.42105 19.9789 4.04211C20 3.64211 19.8526 3.26316 19.5789 2.98947ZM8.90526 13.1368L6.73684 13.2632L6.86316 11.0947L7.47368 10.4842L9.51579 12.5263L8.90526 13.1368ZM16.8632 5.15789L14.8421 3.13684L15.9789 2L18.0211 4.04211L16.8632 5.15789Z"
                  fill="#6DB5D1"
                />
              </svg>
            </span>
            <span class="remove" @click="removeConfirme(item)">
              <svg width="20" height="22" viewBox="0 0 20 22">
                <path
                  d="M19.2208 3.13723H13.6104V2.40995C13.6104 1.85885 13.3915 1.33033 13.0018 0.940641C12.6121 0.550955 12.0836 0.332031 11.5325 0.332031H8.46753C7.91643 0.332031 7.38791 0.550955 6.99822 0.940641C6.60853 1.33033 6.38961 1.85885 6.38961 2.40995V3.13723H0.779221C0.574621 3.14373 0.380177 3.22791 0.23543 3.37266C0.0906828 3.5174 0.00650011 3.71185 0 3.91645C0 4.12311 0.0820961 4.32131 0.228228 4.46744C0.374361 4.61357 0.572559 4.69567 0.779221 4.69567H2.15584V16.8515C2.15584 17.9537 2.59369 19.0108 3.37306 19.7901C4.15243 20.5695 5.20949 21.0074 6.31169 21.0074H13.7143C14.261 21.0108 14.803 20.9057 15.3087 20.698C15.8145 20.4904 16.274 20.1844 16.6606 19.7978C17.0472 19.4112 17.3532 18.9517 17.5608 18.446C17.7684 17.9402 17.8736 17.3982 17.8701 16.8515V4.69567H19.2208C19.4274 4.69567 19.6256 4.61357 19.7718 4.46744C19.9179 4.32131 20 4.12311 20 3.91645C19.9935 3.71185 19.9093 3.5174 19.7646 3.37266C19.6198 3.22791 19.4254 3.14373 19.2208 3.13723ZM7.94805 2.40995C7.94805 2.27218 8.00278 2.14005 8.1002 2.04262C8.19763 1.9452 8.32976 1.89047 8.46753 1.89047H11.5325C11.6702 1.89047 11.8024 1.9452 11.8998 2.04262C11.9972 2.14005 12.0519 2.27218 12.0519 2.40995V3.13723H7.94805V2.40995ZM16.3117 16.8515C16.3117 17.1926 16.2445 17.5304 16.114 17.8455C15.9834 18.1606 15.7921 18.447 15.5509 18.6882C15.3097 18.9293 15.0234 19.1207 14.7083 19.2512C14.3931 19.3817 14.0554 19.4489 13.7143 19.4489H6.31169C5.97059 19.4489 5.63284 19.3817 5.31771 19.2512C5.00257 19.1207 4.71624 18.9293 4.47505 18.6882C4.23386 18.447 4.04253 18.1606 3.912 17.8455C3.78147 17.5304 3.71429 17.1926 3.71429 16.8515V4.69567H16.3117V16.8515Z"
                  fill="#63517A"
                />
                <path
                  d="M6.44133 16.9814C6.64799 16.9814 6.84619 16.8993 6.99232 16.7532C7.13846 16.607 7.22055 16.4088 7.22055 16.2022V7.37099C7.22418 7.26769 7.20651 7.16474 7.16863 7.06856C7.13075 6.97238 7.07349 6.88502 7.00039 6.81193C6.9273 6.73884 6.83995 6.68157 6.74376 6.64369C6.64758 6.60582 6.54464 6.58814 6.44133 6.59177C6.23467 6.59177 6.03647 6.67387 5.89034 6.82C5.74421 6.96613 5.66211 7.16433 5.66211 7.37099V16.2022C5.66861 16.4068 5.75279 16.6012 5.89754 16.746C6.04229 16.8907 6.23673 16.9749 6.44133 16.9814Z"
                  fill="#63517A"
                />
                <path
                  d="M9.99992 16.9814C10.2066 16.9814 10.4048 16.8993 10.5509 16.7532C10.697 16.607 10.7791 16.4088 10.7791 16.2022V7.37102C10.7791 7.16436 10.697 6.96616 10.5509 6.82003C10.4048 6.67389 10.2066 6.5918 9.99992 6.5918C9.79326 6.5918 9.59506 6.67389 9.44893 6.82003C9.3028 6.96616 9.2207 7.16436 9.2207 7.37102V16.2022C9.2207 16.4088 9.3028 16.607 9.44893 16.7532C9.59506 16.8993 9.79326 16.9814 9.99992 16.9814Z"
                  fill="#63517A"
                />
                <path
                  d="M13.5585 16.9814C13.7631 16.9749 13.9575 16.8907 14.1023 16.746C14.247 16.6012 14.3312 16.4068 14.3377 16.2022V7.37099C14.3377 7.16433 14.2556 6.96613 14.1095 6.82C13.9634 6.67387 13.7652 6.59177 13.5585 6.59177C13.4552 6.58814 13.3522 6.60582 13.2561 6.64369C13.1599 6.68157 13.0725 6.73884 12.9994 6.81193C12.9263 6.88502 12.8691 6.97238 12.8312 7.06856C12.7933 7.16474 12.7756 7.26769 12.7793 7.37099V16.2022C12.7793 16.4088 12.8614 16.607 13.0075 16.7532C13.1536 16.8993 13.3518 16.9814 13.5585 16.9814Z"
                  fill="#63517A"
                />
              </svg>
            </span>
          </div>
        </div>
        <div class="card__content_body">
          <p v-if="type === 'card'">**** **** **** {{ item.card.last4 }}</p>
          <p v-else class="bank">{{ item.account_holder_name }}</p>
        </div>
        <div class="card__content_footer">
          <a
            v-if="type !== 'card' && item.status !== 'verified'"
            class="btn btn-small btn-alt-white"
            @click.prevent="verifyAccount(item)"
            >Verify</a
          >
        </div>
      </div>
    </div>
    <div class="btn_overlay center">
      <p v-if="item.id === defaultId">Default</p>
      <a
        v-else
        class="btn btn-underline"
        @click.prevent="makeDefaultConfirm(item)"
        >Make Default</a
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: { type: Object },
    type: { type: String },
    defaultId: { type: String },
  },
  methods: {
    editItem(item, defaultEl) {
      this.$emit("editItem", { item, defaultEl });
    },
    removeConfirme(item) {
      this.$emit("removeConfirme", item);
    },
    makeDefaultConfirm(item) {
      this.$emit("makeDefaultConfirm", item);
    },
    verifyAccount(item) {
      this.$emit("verifyAccount", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn_overlay {
  p {
    font-size: 12px;
    line-height: 1.3;
    font-weight: 700;
    text-transform: none;
    margin-bottom: 0;
    border-bottom: 1px solid transparent;
  }
}
.btn-small {
  height: 4rem;
  line-height: 3.8rem;
  margin: 0 auto;
}
.card {
  display: flex;
  position: relative;
  width: 315px;
  height: 185px;
  border-radius: 16px;
  padding: 18px 24px;
  margin: 0 16px 20px;
  background: linear-gradient(254.9deg, #9c2cf3 3%, #3a49f9 100%);
  @media only screen and (max-width: 399px) {
    width: 280px;
    height: 164px;
    padding: 15px 20px;
    margin: 0 10px 20px;
  }
  &.bank {
    background: linear-gradient(177.23deg, #5ba0ff -13.49%, #3a49f9 109.75%);
  }
  &.pink {
    background: linear-gradient(
      75.65deg,
      #cb8be6 2.65%,
      #e7a2ad 57.22%,
      #f4af56 105.37%
    );
  }
  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .actions {
      display: flex;
      align-items: center;
    }
    span {
      display: block;
      width: 20px;
      height: 20px;
      margin-left: 16px;
      cursor: pointer;
      svg {
        width: 20px;
        height: 20px;
        path {
          transition: all 0.3s ease-in-out;
          fill: #fff;
        }
      }
      &:hover {
        svg path {
          fill: $fieldBorderColor;
        }
      }
    }
    &_header {
      display: flex;
      justify-content: space-between;
      .icon {
        display: flex;
        align-items: center;
        p {
          max-width: 170px;
          font-size: 15px;
          line-height: 2;
          color: #fff;
          margin-bottom: 0;
        }
      }
    }
    &_body {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      flex: 1;
      p {
        font-size: 20px;
        font-weight: 500;
        color: #fff;
        letter-spacing: 4px;
        white-space: nowrap;
        text-align: center;
        margin-bottom: 18px;
        @media only screen and (max-width: 399px) {
          font-size: 17px;
          margin-bottom: 13px;
        }
        &.bank {
          letter-spacing: 2px;
        }
      }
    }
    &_footer {
      display: flex;
      justify-content: center;
      height: 4rem;
    }
  }
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background-image: url(../../../../../assets/img/cardMask.svg);
    z-index: 1;
    border-radius: 16px;
  }
}
</style>