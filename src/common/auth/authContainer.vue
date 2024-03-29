<template>
  <div class="auth__container">
    <transition name="expand">
      <div class="auth__container_body">
        <div class="auth__form">
          <div class="logo">
            <img :src="require(`@/assets/img/logo-blue.svg`)" alt="logo" />
          </div>
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>