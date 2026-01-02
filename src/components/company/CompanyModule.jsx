import React from 'react';
import '@/styles/company.css';

export default function CompanyModule() {
  return (
    <section className="company-module panel">
      <header className="header" role="banner">
        <div className="buy-sell-module">
          <div className="buy-sell-header">GBPUSD</div>
          <table className="quote-table">
            <tbody>
              <tr>
                <td className="buy">
                  <a href="#" className="buy-link">
                    <table>
                      <tbody>
                        <tr>
                          <td>BUY</td>
                        </tr>
                        <tr>
                          <td className="numbers">
                            <span className="base">1.23</span>
                            <span className="important up">45</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="against">(USD 1,000,000,000)</td>
                        </tr>
                      </tbody>
                    </table>
                  </a>
                </td>
                <td className="sell">
                  <a href="#" className="sell-link">
                    <table>
                      <tbody>
                        <tr>
                          <td>SELL</td>
                        </tr>
                        <tr>
                          <td>
                            <span className="base">1.23</span>
                            <span className="important down">42</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="against">(USD 1,000,000,000)</td>
                        </tr>
                      </tbody>
                    </table>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <form className="re-calculator" name="re-calculator">
          <button type="button" className="btn">USD:</button>
          <input type="number" placeholder="1,000,000,000" min="1" max="1000000000" />
        </form>
      </header>

      <hr className="divider" />

      <div className="related-news">
        <h2>RELATED NEWS</h2>
        <ul className="related-news-list">
          {[3,2,1].map((i) => (
            <li key={i}>
              <a href="#">
                <p className="article-title">GBP related news article link to go here and here and wrap as required.</p>
              </a>
              <p className="article-datetime">
                <span className="date">01 OCT 2012</span>
                <span className="time">12:28 CET</span>
                <span className="time-passed">(2hrs 10min ago)</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      <footer className="footer" role="contentinfo">
        <h3>YOUR SALES REPRESENTATIVE:</h3>
        <div className="bio">
          <img className="bio-pic" src="http://www.placekitten.com/50/50" alt="rep" />
          <div className="name">
            <div className="names"><span className="first-name">Firstname</span>&nbsp;<span className="last-name">Lastname</span></div>
            <a className="contact-link" href="#">CONTACT NOW</a>
          </div>
        </div>
      </footer>
    </section>
  );
}
