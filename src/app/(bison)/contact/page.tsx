import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import "../../../styles/contact.css";
import CopyEmail from "../../../components/CopyEmail";

export default async function ContactPage() {
  const locale = await getLocale();
  const tr = t(locale).contact;

  return (
    <div className="contact-page">
      <h1 className="contact-heading">{tr.heading}</h1>

      <div className="contact-sections">
        <section className="contact-section">
          <h2 className="contact-section__title">{tr.bookings}</h2>
          <dl className="contact-list">
            <div className="contact-list__row">
              <dt>{tr.phone}</dt>
              <dd><a href="tel:7225189605">722 518 9605</a></dd>
            </div>
            <div className="contact-list__row">
              <dt>Email</dt>
              <dd><CopyEmail locale={locale} email="bear@bisonrecords.co" /></dd>
            </div>
          </dl>
        </section>

        <section className="contact-section">
          <h2 className="contact-section__title">{tr.press}</h2>
          <dl className="contact-list">
            <div className="contact-list__row">
              <dt>Email</dt>
              <dd><CopyEmail locale={locale} email="contacto.pmmusic@gmail.com" /></dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
