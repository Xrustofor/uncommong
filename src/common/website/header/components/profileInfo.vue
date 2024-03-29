<template>
  <div class="profile__info" @click.stop="profileOpen()">
    <div class="profile__info_logo">
      <span
        v-if="user.image"
        class="image"
        :style="{ backgroundImage: `url(${user.image})` }"
      >
      </span>
      <span v-else class="name">{{ user.initials }}</span>
    </div>
    <div class="profile__info_name">
      <h4>{{ user.first_name }} {{ user.last_name }}</h4>
      <p>Donor</p>
    </div>
    <ul class="menu_content" :class="{ open: profileVisible }">
      <li v-for="i in menu" :key="i.id" class="main_options">
        <router-link v-if="i.url" :to="i.url" v-slot="{ href, navigate }" custom
          ><a :href="href" @click="navigate">
            {{ i.title }}
          </a>
        </router-link>
        <a :href="i.path" target="_blank" v-else>
          {{ i.title }}
        </a>
      </li>
      <li class="headline">
        <a @click.stop="logout"> Log Out </a>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: { profileClosed: { type: Boolean } },
  data() {
    return {
      menu: [{ id: 1, title: "Account", url: "/admin" }],
      profileVisible: false,
    };
  },
  computed: {
    ...mapGetters("user", {
      user: "getUser",
    }),
  },
  watch: {
    profileClosed() {
      this.profileVisible = !this.profileClosed;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    profileOpen() {
      this.profileVisible = !this.profileVisible;
      this.$emit("profileOpen");
    },
  },
};
</script>
<style lang="scss" scoped>
.profile__info {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  &_logo {
    margin: 0 13px;
    span {
      display: flex;
      width: 4.5rem;
      height: 4.5rem;
      min-width: 4.5rem;
      min-height: 4.5rem;
      background-position: center center;
      background-size: cover;
      transition: all linear 0.3s;
      border-radius: 50%;
      border: 3px solid #fff;
      @include transition();
      &.name {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $violetBorder;
        font-weight: 700;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
  &_name {
    h4 {
      font-size: 14px;
      color: $indigo;
      font-weight: 600;
    }
    P {
      font-size: 12px;
      color: $indigo;
    }
  }
  .menu_content {
    min-width: 175px;
    bottom: -20px;
    transform: translateY(100%);
    position: absolute;
    border-radius: 18px;
    border: 1px solid $fieldBorderColor;
    background: #fff;
    opacity: 0;
    z-index: -1;
    visibility: hidden;
    @include transition();
    li.main_options a {
      font-weight: 600;
    }
    li.headline {
      &:before {
        content: "";
        top: 0;
        left: 50%;
        width: calc(100% - 40px);
        height: 1px;
        transform: translate(-50%, 0);
        background-color: rgba(99, 81, 122, 0.3);
      }
    }
    &.open {
      opacity: 1;
      visibility: visible;
      z-index: 9;
    }
  }
}
</style>