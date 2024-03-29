<template>
  <ul class="socials">
    <li v-for="(item, id) in socials" :key="id">
      <a target="_blank" :href="item.url">
        <img :src="require(`@/assets/img/${item.path}`)" :alt="item.name" />
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      socials: [
        {
          path: "facebook.svg",
          name: "facebook",
          url: process.env.VUE_APP_URL_FACEBOOK || '',
        },
        {
          path: "youtube.svg",
          name: "youtube",
          url: process.env.VUE_APP_URL_YOUTUBE || '',
        },
        {
          path: "instagram.svg",
          name: "instagram",
          url: process.env.VUE_APP_URL_INSTAGRAM || '',
        },
        {
          path: "twitter.svg",
          name: "twiter",
          url: process.env.VUE_APP_URL_TWITTER || '',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.socials {
  display: flex;
  justify-content: flex-end;
  margin: 7.5px 0;
  li {
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: $violetBorder;
      margin: 0 15px;
      cursor: pointer;
      &:hover {
        background-color: #e1d9f0;
      }
      @media only screen and (max-width: 599px) {
        margin: 0 5px;
      }
      &:last-of-type {
        margin-right: 0;
      }
      &:first-of-type {
        margin-left: 0;
      }
      img {
        opacity: 0.7;
        width: 18px;
      }
    }
  }
  &.dark {
    li {
      border-radius: 0;
      background-color: transparent;
      margin: 0 25px;
      @media only screen and (max-width: 1299px) {
        margin: 0 15px;
      }
      @media only screen and (max-width: 599px) {
        margin: 20px 5px 0;
      }
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
    img {
      opacity: 1;
    }
  }
}
</style>