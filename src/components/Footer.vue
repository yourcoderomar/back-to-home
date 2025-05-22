<template>
  <div class="footer">
    <div class="footer-container">
      <!-- Main Navigation -->
      <div class="footer-box">
        <h5>GET HELP</h5>
        <router-link to="/SearchReports"><p>Search Reports</p></router-link>
        <router-link to="/ReportMissing"><p>Search Missing Person</p></router-link>
        <router-link to="/ReportMissing"><p>Report a Missing Person</p></router-link>
        <router-link to="/ReportFound"><p>Report a Found Person</p></router-link>
        <router-link to="/About"><p>About Us</p></router-link>
      </div>
      <!-- Resources -->
      <div class="footer-box">
        <h5>RESOURCES</h5>
        <router-link to="/profile"><p>Profile</p></router-link>
        <router-link to="/settings"><p>Settings</p></router-link>
        <router-link to="/security"><p>Security</p></router-link>
      </div>

      <!-- Contact Information -->
      <div class="footer-box">
        <h5>CONTACT US</h5>
        <div class="contact-info">
          <p><i class="fas fa-envelope"></i> back2home@gmail.com</p>
          <p><i class="fas fa-phone"></i> 01155306633</p>
          <p><i class="fas fa-map-marker-alt"></i> Cairo, Egypt</p>
          <router-link to="/contact-us"
            ><p><i class="fas fa-phone-alt"></i> Contact Us</p></router-link
          >
        </div>
      </div>

      <!-- Newsletter & Social -->
      <div class="footer-box newsletter-box">
        <h5>STAY UPDATED</h5>
        <div class="newsletter-form">
          <div class="input-group">
            <input type="email" v-model="email" placeholder="Enter your email" />
            <button class="subscribe-btn" @click="handleSubscribe">Subscribe</button>
          </div>
        </div>
        <div class="social-section">
          <h5>FOLLOW US</h5>
          <div class="social-icons">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
            >
              <i class="fa-brands fa-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
            >
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://www.tiktok.com/foryou"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
            >
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <div class="footer-bottom">
      <p class="copyrights">&copy; 2024 Back2home. All rights reserved.</p>
      <div class="footer-links">
        <a href="#" @click.prevent="showTerms = true">Terms of Service</a>
        <a href="#" @click.prevent="showPrivacy = true">Privacy Policy</a>
        <a href="#" @click.prevent="showCookies = true">Cookie Policy</a>
      </div>
    </div>

    <!-- Dialogs -->
    <TermsDialog v-model="showTerms" />
    <PrivacyDialog v-model="showPrivacy" />
    <CookieDialog v-model="showCookies" />
    <ToastNotification ref="toast" />
  </div>
</template>

<script>
import TermsDialog from './dialogs/TermsDialog.vue'
import PrivacyDialog from './dialogs/PrivacyDialog.vue'
import CookieDialog from './dialogs/CookieDialog.vue'
import ToastNotification from './ToastNotification.vue'

export default {
  name: 'FooterDiv',
  components: {
    TermsDialog,
    PrivacyDialog,
    CookieDialog,
    ToastNotification,
  },
  data() {
    return {
      showTerms: false,
      showPrivacy: false,
      showCookies: false,
      email: '',
    }
  },
  methods: {
    handleSubscribe() {
      if (!this.email) {
        this.$refs.toast.showToast('Please enter your email address', 'error')
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.$refs.toast.showToast('Please enter a valid email address', 'error')
        return
      }

      // Here you would typically make an API call to subscribe the user
      // For now, we'll just show a success message
      this.$refs.toast.showToast('Thank you for subscribing to our newsletter!', 'success')
      this.email = '' // Clear the input after successful subscription
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../css/Footer.scss';

.footer {
  background-color: #f2f0e9;
  padding: 40px 0 20px;
  margin-top: 60px;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    padding: 0 20px;
  }

  .footer-box {
    h5 {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 20px;
      font-weight: 600;
    }

    p {
      color: #666;
      margin: 10px 0;
      font-size: 0.9rem;
      transition: color 0.3s ease;

      &:hover {
        color: #49596b;
      }
    }
  }

  .contact-info {
    p {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 15px 0;

      i {
        color: #49596b;
      }
    }
  }

  .newsletter-box {
    .newsletter-form {
      margin-bottom: 20px;

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;

        input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;

          &:focus {
            outline: none;
            border-color: #49596b;
          }
        }

        .subscribe-btn {
          width: 100%;
          padding: 10px;
          background-color: #49596b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-weight: 500;

          &:hover {
            background-color: #3a4756;
          }
        }
      }
    }

    .social-section {
      margin-top: 30px;

      h5 {
        margin-bottom: 15px;
      }

      .social-icons {
        display: flex;
        gap: 15px;
        margin-top: 10px;

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #49596b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;

          &:hover {
            transform: translateY(-3px);
            background-color: #3a4756;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          i {
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  hr {
    margin: 30px 0;
    border: none;
    border-top: 1px solid #ddd;
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;

    .copyrights {
      color: #666;
      font-size: 0.9rem;
    }

    .footer-links {
      display: flex;
      gap: 20px;

      a {
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;

        &:hover {
          color: #49596b;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .footer {
    .footer-container {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .contact-info p {
      justify-content: center;
    }

    .newsletter-form {
      .input-group {
        max-width: 300px;
        margin: 0 auto;
      }
    }

    .social-section {
      .social-icons {
        justify-content: center;
      }
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;

      .footer-links {
        justify-content: center;
      }
    }
  }
}
</style>
