import "../contact/Contact.js";
import React from "react";

const Contact = () => {
  return (
    <div>
      <div className="map">
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d432.1776421150913!2d105.77643685959059!3d10.048769812250757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089faf5c47ec9%3A0x83c6ec48f3917913!2sFpt%20Arena%20Multimedia!5e1!3m2!1svi!2s!4v1706514755581!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
          width="500"
          height="550"
          className="border-0 w-100 p-lg-5"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div>
        <div className="information-customer box">

        </div>
      </div>
    </div>
  );
};
export default Contact;
