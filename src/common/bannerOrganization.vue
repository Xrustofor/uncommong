<template>
  <div class="banner" :class="{ 'banner--no-cover': !fields.cover_photo }">
    <img
      v-if="!fields.cover_photo"
      class="banner__picture"
      :src="require('@/assets/img/default_picture.svg')"
      alt=""
    />
    <img v-if="fields.cover_photo" :src="fields.cover_photo" alt="" class="banner__cover" />

    <div class="socials">
      <a
        class="socials__item link_icon"
        @click="
          copy()
          $emit('shareAction')
        "
      >
        <icon-base width="50" height="50" viewBox="0 0 50 50" icon-name="share">
          <iconShareCopy></iconShareCopy>
        </icon-base>
      </a>
      <ShareNetwork
        class="socials__item link_icon"
        v-for="(item, key) in optionsSocial"
        :key="key"
        :network="item.network"
        :url="item.url"
        :title="fields.name ? fields.name : ''"
        :description="fields.short_description"
        hashtags="#"
        @close="$emit('shareAction')"
      >
        <icon-base width="50" height="50" viewBox="0 0 50 50" :icon-name="item.network">
          <component v-bind:is="item.iconType"></component>
        </icon-base>
      </ShareNetwork>
    </div>

    <div class="banner__content">
      <div class="description-block" v-if="Object.keys(fields).length !== 0">
        <h1>
          {{ fields.name ? fields.name : 'Please type fundraiser title' }}
        </h1>
        <h4 class="subtitle" v-if="fields.subtitle">
          {{ fields.subtitle }}
        </h4>
        <h4 class="description">
          {{
            fields.short_description ? fields.short_description : 'Please type short description'
          }}
        </h4>
      </div>
      <div class="progress-block">
        <div class="header">
          <span
            class="logo"
            @click="
              $router.push({
                path: `/nonprofits/${
                  fields.organization_slug ? fields.organization_slug : fields.organization.slug
                }`,
              })
            "
            :style="{ backgroundImage: `url(${imageLogo})` }"
          ></span>
          <p
            v-if="Object.keys(fields).length !== 0"
            class="title-logo"
            @click="
              $router.push({
                path: `/nonprofits/${
                  fields.organization_slug ? fields.organization_slug : fields.organization.slug
                }`,
              })
            "
          >
            {{
              fields.organization_name
                ? fields.organization_name
                : fields.organization
                ? fields.organization.name
                : ''
            }}
          </p>
        </div>
        <donationProgress
          raisedText="RAISED: "
          goalText="GOAL: "
          :raised="fields.amount_raised / 100"
          :goal="fields.goal / 100"
        />
        <div class="donation-progress">
          <div class="donation-progress__results">
            <div class="item">
              <icon-base>
                <icon-like></icon-like>
              </icon-base>
              <span class="title">{{ fields.uniqueDonorsCount }} DONORS</span>
            </div>
            <div class="item">
              <icon-base>
                <icon-telegram></icon-telegram>
              </icon-base>
              <span class="title">{{ fields.shared_count }} SHARES</span>
            </div>
          </div>
          <div class="donation-progress__donate">
            <span
              v-if="
                fields.status !== 'completed' && fields.status !== 'paused' && fields.daysRemains
              "
              class="title"
            >
              {{ fields.daysRemains }}
            </span>
            <!-- onDone: scrollToSection, -->
            <loader-button
              v-if="isBtnDonate"
              text="DONATE"
              class="btn-yellow"
              @emitClick="$emit('donate', true)"
              v-scroll-to="{ el: anchorName || '' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase'
import iconFacebook from '@/components/icons/iconFacebook'
import iconTwitter from '@/components/icons/iconTwitter'
import iconShareCopy from '@/components/icons/iconShareCopy'

import donationProgress from '@/components/donationProgress'
import iconTelegram from '@/components/icons/iconTelegram'
import iconLike from '@/components/icons/iconLike'
import LoaderButton from '@/components/buttons/loaderButton'

export default {
  components: {
    IconBase,
    iconFacebook,
    iconTwitter,
    iconShareCopy,
    donationProgress,
    iconTelegram,
    iconLike,
    LoaderButton,
  },
  props: {
    anchorName: String,
    fields: {
      type: Object,
      default() {
        return {}
      },
      required: true,
    },
    isBtnDonate: {
      type: [Boolean, Number],
      default: true,
    },
  },
  data() {
    return {
      optionsSocial: [
        {
          iconType: 'iconFacebook',
          network: 'facebook',
          url: `${window.location}`,
        },
        {
          iconType: 'iconTwitter',
          network: 'twitter',
          url: `${window.location}`,
        },
      ],
    }
  },
  computed: {
    imageLogo() {
      let urlImageLogo = this.fields.organization
        ? this.fields.organization.image || this.fields.organization.second_image
        : ''
      if (!urlImageLogo) {
        urlImageLogo = this.fields.organization_image
      }
      return urlImageLogo
    },
  },
  methods: {
    copy() {
      const temp = document.createElement('input')
      temp.value = `${window.location}`
      document.body.appendChild(temp)
      temp.select()
      document.execCommand('copy')
      document.body.removeChild(temp)

      let instance = this.$toast.success('Copied!', {
        position: 'top',
        duration: 3000,
        queue: true,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

.banner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 550px;
  max-width: 1360px;
  margin: 27px auto 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  padding-top: 6rem;

  &--no-cover {
    background-color: #f2eff8;
  }

  &__cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }

  &__picture {
    position: absolute;
    top: 50px;
    left: 50%;
    width: 70px;
    height: 130px;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 470px;
    grid-column-gap: 75px;
    grid-row-gap: 30px;
    min-height: 315px;
    margin: 20px 40px 0;
    padding: 25px 50px;
    background: rgba(49, 91, 156, 0.8);
    border-radius: 20px 20px 0 0;
    color: $white;
    z-index: 1;

    .subtitle {
      padding-top: 20px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .description {
      padding-top: 20px;
      font-weight: 400;
    }

    .header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .logo {
      width: 100px;
      height: 100px;
      min-width: 100px;
      min-height: 100px;
      border-radius: 20px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-color: $violetBorder;
      cursor: pointer;
    }

    .title-logo {
      padding-left: 20px;
      font-weight: 800;
      font-size: $fs2;
      line-height: $lh2;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      cursor: pointer;
    }
  }

  ::v-deep.donation-progress {
    padding-top: 20px;
  }

  @media (max-width: $lg) {
    &__content {
      display: block;
      margin: 20px 0 0;
      padding: 25px 20px;
      border-radius: 20px;

      .title {
        font-size: 20px;
        line-height: 30px;
      }

      .header {
        margin-top: 20px;
      }
    }
  }
  @media (max-width: 1400px) {
    margin: 27px 20px 0;
  }
}

.donation-progress {
  max-width: 500px;
  margin: 0 auto;

  &__results {
    display: flex;
    justify-content: center;
    padding: 20px 0 0;

    .item {
      display: flex;
      align-items: center;
      margin: 0 25px;
    }

    .icon {
      height: 17px;
    }

    .title {
      padding-left: 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    @media (max-width: $sm) {
      padding: 20px 20px 0;
    }
    @media (max-width: $xs) {
      padding: 20px 0 0;
    }
  }

  &__donate {
    padding-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      padding-right: 14px;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
  }
}

.socials {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 2;
  display: flex;

  &__item {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 10px;
    opacity: 0.8;
    border-radius: 50%;
    transition: opacity linear 0.3s;
    cursor: pointer;
    color: $white;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 1;
    }
  }
}

@media (max-width: 1225px) {
  .mode-preview {
    .banner__content {
      display: block;
      margin: 20px 0 0;
      padding: 25px 20px;
      border-radius: 20px;

      .title {
        font-size: 20px;
        line-height: 30px;
      }

      .header {
        max-width: 500px;
        margin: 20px auto 0;
      }
    }
  }
}

@media (max-width: $sm) {
  .donation-progress__results {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;

    .item {
      margin: 0;
    }
  }
}

@media (max-width: $xxs) {
  .banner {
    margin-right: 0;
    margin-left: 0;
  }
  .banner__content .header {
    align-items: flex-start;
    flex-direction: column;

    .title-logo {
      font-size: 25px;
      padding: 15px 0 0 0;
    }
  }
}
</style>
