// app/about/page.js - 運営者情報・編集方針
import Link from 'next/link';
import { SITE_NAME, OPERATOR_NAME, CONTACT_NAME, CONTACT_EMAIL, CONTACT_FORM_URL } from '../../lib/site';

export const metadata = {
  title: 'PR-KINGについて（運営者情報・編集方針）',
  description: 'PR-KINGの運営者情報、編集方針、広告・アフィリエイトに関する表記、お問い合わせ先をご案内します。',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {

  return (
    <div className="gizmodo-main-container">
      <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span className="sep">/</span>
        <span className="current">ABOUT</span>
      </nav>

      <article className="gizmodo-article-container" style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 className="gizmodo-post-title">{SITE_NAME}について</h1>

        <div className="gizmodo-post-body">
          <h2>サイトの目的</h2>
          <p>
            {SITE_NAME}は、クレジットカード・新NISA・節約・キャッシュレスなど、お金まわりの選択肢をわかりやすく整理して紹介する情報メディアです。
            カードやサービスの違いを比べるときの「見方」を中心に、読者が自分で判断できる材料を提供することを目指しています。
          </p>

          <h2>運営者情報</h2>
          <table>
            <tbody>
              <tr>
                <th>サイト名</th>
                <td>{SITE_NAME}</td>
              </tr>
              <tr>
                <th>運営者</th>
                <td>{OPERATOR_NAME}</td>
              </tr>
              <tr>
                <th>お問い合わせ</th>
                <td>
                  <span>{CONTACT_NAME}</span>
                  {CONTACT_EMAIL && (<><br /><span>{CONTACT_EMAIL}</span></>)}
                  {CONTACT_FORM_URL && (
                    <>
                      <br />
                      <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer">
                        お問い合わせフォーム
                      </a>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <h2>編集方針</h2>
          <ul>
            <li>商品・サービスの仕様（年会費、還元率、付与条件など）は、公式サイトの公開情報をもとに記載します。条件は予告なく変更されるため、申し込み前に必ず公式サイトで最新情報をご確認ください。</li>
            <li>確認できていない情報や、個人の感想にすぎないものを、事実や体験談であるかのように記載しません。</li>
            <li>「最強」「絶対」など、根拠を示せない断定的な表現はできる限り避けます。</li>
            <li>誤りのご指摘をいただいた場合は、確認のうえ速やかに修正します。</li>
          </ul>

          <h2>広告・アフィリエイトについて</h2>
          <p>
            当サイトは、アフィリエイトプログラムを利用して商品・サービスを紹介しており、記事内のリンクを経由して申し込みや購入が行われた場合に、運営者が紹介料などの報酬を受け取ることがあります。
            広告を含む記事には「PR」「広告」などの表記を付けています。報酬の有無や金額によって、記事中の評価や順位を変更することはしません。
          </p>

          <h2>免責事項</h2>
          <p>
            当サイトの情報は、掲載時点の公開情報をもとに作成していますが、正確性・完全性を保証するものではありません。
            当サイトの情報を利用したことで生じた損害について、運営者は責任を負いかねます。投資・契約などの最終的な判断は、ご自身の責任で行ってください。
            また、当サイトは特定の金融商品の勧誘を目的とするものではありません。
          </p>

          <h2>画像について</h2>
          <p>
            記事内のイメージ画像には、<a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>
            のもとで提供されている写真を使用しています。商品・サービスの実物を示すものではありません。
          </p>

          <h2>関連ページ</h2>
          <ul>
            <li><Link href="/privacy/">プライバシーポリシー</Link></li>
            <li><Link href="/posts/">記事一覧</Link></li>
          </ul>
        </div>
      </article>
    </div>
  );
}
