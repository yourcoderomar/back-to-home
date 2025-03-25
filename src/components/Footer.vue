<template>
    <div class="footer">
      <div class="footer-container">
        <div class="footer-box">
          <h5>GET HELP</h5>
          <router-link to="#"><p>Being missing</p></router-link>
          <router-link to="#"><p>My loved ones are missing</p></router-link>
          <router-link to="#"><p>Report a missing person</p></router-link>
        </div>
        <div class="footer-box">
          <h5>HELP US FIND</h5>
          <router-link to="#"><p>File a report</p></router-link>
          <router-link to="#"><p>Find a missing person</p></router-link>
        </div>
        <div class="footer-box">
          <h5>SUPPORT US</h5>
          <a href="/"><p>back2home@gmail.com</p></a>
          <a href="/"><p>01155306633</p></a>
        </div>
        <div class="footer-icon-box">
          <div class="footer-icon">  
            <a href="https://www.facebook.com/">
              <i class="fa-brands fa-facebook"></i>
            </a>
          </div>
          <div class="footer-icon">  
            <a href="https://www.instagram.com/">
              <i class="fa-brands fa-instagram"></i>
            </a>
          </div>
          <div class="footer-icon">  
            <a href="https://www.tiktok.com/foryou">
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <hr />
      <p class="copyrights">&copy; 2024 Back2home. All rights reserved.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FooterDiv'
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../css/Footer.scss";
  </style>