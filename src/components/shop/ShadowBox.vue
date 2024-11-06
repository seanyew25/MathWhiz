<template>
  <!-- <div class="nes-container is-rounded">Hello</div> -->
  <div class="shadow-box">Hello</div>
</template>
<style scoped>
.shadow-box {
  color: inherit;
  font-family: "retro", sans-serif;
  font-size: 0.9em;
  background: white;
  padding: 0.3rem 3.4rem;
  border: 3px solid black;
  border-width: 3px;
  margin-right: 2.6rem;
  box-shadow: 0 0 0 black;
  transition: all 0.2s;
  padding-top: 10px;
  height: 200px;
  width: 300px;
}
.shadow-box:last-child {
  margin: 0;
}
a,
.shadow-box:hover {
  box-shadow: 0.4rem 0.4rem 0rem black;
  /* cursor: URL("../../assets/img/cursor/cursor-click.png"), auto; */
  /*transform: translate(-0.4rem, -0.4rem);*/
}
.shadow-box:active {
  box-shadow: 0 0 0 black;
  transform: translate(0, 0);
  /* cursor: URL("../../assets/img/cursor/cursor-click.png"), active; */
}
</style>
