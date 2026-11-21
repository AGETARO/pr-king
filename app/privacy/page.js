// app/privacy/page.js - プライバシーポリシー
import Link from 'next/link';
import {
  SITE_NAME,
  OPERATOR_NAME,
  CONTACT_NAME,
  CONTACT_EMAIL,
  CONTACT_FORM_URL,
  POLICY_ENACTED,
  POLICY_UPDATED,
} from '../../lib/site';

export const metadata = {
  title: 'プライバシーポリシー',
  description: 'PR-KINGにおける個人情報・アクセス解析・Cookie・広告配信・アフィリエイトの取り扱いについて定めたプライバシーポリシーです。',
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  const operator = OPERATOR_NAME || `${SITE_NAME}運営者`;

  return (
    <div className="gizmodo-main-container">
      <nav className="gizmodo-breadcrumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span className="sep">/</span>
        <span className="current">PRIVACY</span>
      </nav>

      <article className="gizmodo-article-container" style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 className="gizmodo-post-title">プライバシーポリシー</h1>

        <div className="gizmodo-post-body">
          <p>
            {operator}（以下「当サイト運営者」）は、{SITE_NAME}（以下「当サイト」）における、利用者の情報の取り扱いについて、以下のとおり定めます。
          </p>

          <h2>1. 取得する情報</h2>
          <p>
            当サイトは会員登録機能を設けておらず、氏名・住所・電話番号・クレジットカード番号などの個人情報を、利用者から直接入力いただいて取得することはありません。
            お問い合わせをいただいた場合に限り、お名前・メールアドレス・お問い合わせ内容などをお預かりします。
          </p>
          <p>
            このほか、アクセス解析ツールや広告配信事業者を通じて、閲覧したページ、閲覧日時、参照元、端末・ブラウザの種類、おおよその地域などの情報が、Cookie等を用いて自動的に収集されます。これらの情報単体で特定の個人を識別することはできません。
          </p>

          <h2>2. 利用目的</h2>
          <ul>
            <li>お問い合わせへの回答のため</li>
            <li>当サイトの利用状況を把握し、コンテンツやサービスを改善するため</li>
            <li>アフィリエイトプログラムの成果の確認のため</li>
            <li>不正アクセスや規約違反への対応のため</li>
          </ul>

          <h2>3. アクセス解析ツール（Google アナリティクス）</h2>
          <p>
            当サイトは、Googleが提供するアクセス解析サービス「Google アナリティクス」を利用しています。
            Google アナリティクスはCookieを使用してトラフィックデータを収集します。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p>
            Cookieは、ブラウザの設定で無効にすることにより、収集を拒否できます。また、
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google アナリティクス オプトアウト アドオン</a>
            を利用することでも、データ収集を無効にできます。
            Googleによるデータの取り扱いについては、
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Googleのポリシーと規約</a>
            をご確認ください。
          </p>

          <h2>4. 広告・アフィリエイトプログラムについて</h2>
          <p>
            当サイトは、各種アフィリエイトプログラム（ASP（アフィリエイト・サービス・プロバイダ）経由の提携や、Amazonアソシエイト・プログラム等）に参加している場合があります。
            記事内のリンクを経由して商品・サービスの申し込みや購入が行われると、当サイト運営者に報酬が支払われることがあります。
          </p>
          <p>
            これらの広告配信事業者・ASPは、利用者の興味に応じた広告の表示や成果の計測のために、Cookie等を使用して、当サイトや他のサイトへのアクセス情報（氏名・住所・メールアドレス・電話番号は含まれません）を取得する場合があります。
            詳細は各事業者のプライバシーポリシーをご確認ください。
          </p>
          <p>広告を含む記事には「PR」「広告」などの表記を付けています。</p>

          <h2>5. 第三者への提供</h2>
          <p>
            当サイト運営者は、法令に基づく場合を除き、お預かりした個人情報を本人の同意なく第三者に提供しません。
            なお、上記3・4のとおり、アクセス解析ツールや広告配信事業者が、Cookie等によって情報を取得することがあります。
          </p>

          <h2>6. 外部サイトへのリンク</h2>
          <p>
            当サイトには、クレジットカード会社をはじめとする外部サイトへのリンクが含まれます。リンク先の内容や、リンク先での個人情報の取り扱いについて、当サイト運営者は責任を負いません。
            申し込み時の入力情報は、リンク先の事業者のプライバシーポリシーに基づいて取り扱われます。
          </p>

          <h2>7. 免責事項</h2>
          <p>
            当サイトに掲載する情報は、掲載時点の公開情報をもとに作成していますが、正確性・完全性を保証するものではありません。
            年会費・ポイント還元率・付与条件などは予告なく変更されることがあるため、最新の内容は必ず各社の公式サイトでご確認ください。
            当サイトの情報を利用して生じた損害について、当サイト運営者は責任を負いません。
          </p>

          <h2>8. 著作権・画像について</h2>
          <p>
            当サイトの文章・構成の著作権は、当サイト運営者に帰属します。無断での転載・複製はご遠慮ください。
            引用する場合は、出典として当サイトへのリンクを明記してください。
            記事内のイメージ画像は、Unsplash Licenseのもとで提供されている写真を使用しています。
          </p>

          <h2>9. プライバシーポリシーの変更</h2>
          <p>
            当サイト運営者は、法令の変更や運営内容の変更に応じて、本ポリシーを予告なく改定することがあります。改定後の内容は、このページに掲載した時点から効力を生じます。
          </p>

          <h2>10. お問い合わせ</h2>
          <p>本ポリシーに関するお問い合わせは、次の窓口までお願いします。</p>
          <p>
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
          </p>

          <p>
            制定日：{POLICY_ENACTED}
            <br />
            最終改定日：{POLICY_UPDATED}
          </p>
        </div>
      </article>
    </div>
  );
}
