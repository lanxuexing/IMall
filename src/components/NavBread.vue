<template>
    <div class="nav-breadcrumb-wrap">
      <div class="container">
        <nav class="nav-breadcrumb">
          <a href="/">Home</a>
          <!-- 插槽，提供面包屑扩展，第一种方式，无名 -->
          <slot></slot>
          <!-- 插槽，提供面包屑扩展，第二种方式，有名 -->
          <slot name="bread"></slot>
        </nav>
      </div>
    </div>
</template>