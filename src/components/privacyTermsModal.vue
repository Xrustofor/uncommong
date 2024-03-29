<template>
  <transition name="fade" appear>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-overlay_background" @click="$emit('hideModal')"></div>
      <transition name="pop" appear>
        <div class="modal" v-if="showModal">
          <span @click="$emit('hideModal')" class="close">
            <img :src="require(`@/assets/img/close.svg`)" alt="logo" />
          </span>
          <div id="printMe">
            <div class="modal_header">
              <h4>TERMS OF SERVICE AND PRIVACY POLICY</h4>
            </div>
            <div class="modal_content">
              <p>
                Welcome to Uncommon Good. Our mission is to help non-profit organizations and
                consumers connect to each other and access tools and services available on our
                “social platform for good”.
              </p>
              <p>
                By using the Website and clicking that You agree to its terms You accept and agree
                to be bound and abide by these Terms of Use and our Privacy Policy. If You do not
                want to agree to these Terms of Use or the Privacy Policy, You must not access or
                use the Website.
              </p>
              <h3>Website Privacy Policy</h3>
              <p></p>
              <h6>Introduction</h6>
              <p>
                Uncommon Good, Inc. (”<strong>Company</strong>” or “<strong>We</strong>”) respects
                your privacy and is committed to protecting it through our compliance with this
                policy. This policy describes the types of information we may collect from you or
                that you may provide when you visit the website
                <a href="https://uncommongood.io/" target="_blank">www.uncommongood.io</a>
                (our “<strong>Website</strong>”) and our practices for collecting, using,
                maintaining, protecting, and disclosing that information. This policy applies to
                information we collect:
              </p>
              <ul>
                <li>On this Website.</li>
                <li>In email, text, and other electronic messages between you and this Website.</li>
                <li>
                  Through mobile and desktop applications you download from this Website, which
                  provide dedicated non-browser-based interaction between you and this Website.
                </li>
                <li>
                  When you interact with our advertising and applications on third-party websites
                  and services, if those applications or advertising include links to this policy.
                </li>
              </ul>
              <p>It does not apply to information collected by:</p>
              <ul>
                <li>
                  Us offline or through any other means, including on any other website operated by
                  Company or any third party (including our affiliates and subsidiaries)]; or
                </li>
                <li>
                  Any third party including our business partners including through any application
                  or content that may link to or be accessible from or on the Website.
                </li>
              </ul>
              <p>
                Please read this policy carefully to understand our policies and practices regarding
                your information and how we will treat it. If you do not agree with our policies and
                practices, your choice is not to use our Website. By accessing or using this
                Website, you agree to this privacy policy. This policy may change from time to time
                (see Changes to Our Privacy Policy). Your continued use of this Website after we
                make changes is deemed to be acceptance of those changes, so please check the policy
                periodically for updates.
              </p>
              <h6>Children Under the Age of 13</h6>
              <p>
                Our Website is not intended for children under 13 years of age. No one under age 13
                may provide any personal information on the Website. We do not knowingly collect
                personal information from children under 13. If you are under 13, do not use or
                provide any information on this Website or through any of its features, or register
                on the Website, make any purchases through the Website, use any of the interactive
                or public comment features of this Website, or provide any information about
                yourself to us, including your name, address, telephone number, email address, or
                any screen name or username you may use. If we learn we have collected or received
                personal information from a child under 13 without verification of parental consent,
                we will delete that information. If you believe we might have any information from
                or about a child under 13, please contact us at support@uncommongood.io.
              </p>
              <h6>Information We Collect About You and How We Collect It</h6>
              <p>
                We collect several types of information from and about users of our Website,
                including information:
              </p>
              <ul>
                <li>
                  By which you may be personally identified, such as name, postal address, e-mail
                  address, telephone number, or any other identifier by which you may be contacted
                  online or offline (”<strong>personal information</strong>”);
                </li>
                <li>That is about you but individually does not identify you; and/or</li>
                <li>
                  About your internet connection, the equipment you use to access our Website, and
                  usage details.
                </li>
              </ul>
              <p>We collect this information:</p>
              <ul>
                <li>Directly from you when you provide it to us.</li>
                <li>
                  Automatically as you navigate through the site. Information collected
                  automatically may include usage details, IP addresses, and information collected
                  through cookies, web beacons,
                </li>
                <li>From third parties, for example, our business partners.</li>
              </ul>
              <h6>Information You Provide to Us</h6>
              <p>The information we collect on or through our Website may include:</p>
              <ul>
                <li>
                  Information that you provide by filling in forms on our Website. This includes
                  information provided at the time of registering to use our Website, subscribing to
                  our service, posting material, or requesting further services]. We may also ask
                  you for information [when you enter a contest or promotion sponsored by us, and]
                  when you report a problem with our Website.
                </li>
                <li>
                  Records and copies of your correspondence (including email addresses), if you
                  contact us.
                </li>
                <li>
                  Your responses to surveys that we might ask you to complete for research and
                  volunteer fulfillment purposes.
                </li>
                <li>
                  Details of transactions you carry out through our Website and of the fulfillment
                  of your orders. You may be required to provide financial information before
                  placing an order through our Website.
                </li>
                <li>Your search queries on the Website.</li>
              </ul>
              <p>
                You also may provide information to be published or displayed (hereinafter,
                “<strong>posted</strong>”) on public areas of the Website or transmitted to other
                users of the Website or third parties (collectively, “<strong
                  >User Contributions</strong
                >”). Your User Contributions are posted on and transmitted to others at your own
                risk. Although [we limit access to certain pages/you may set certain privacy
                settings for such information by logging into your account profile], please be aware
                that no security measures are perfect or impenetrable. Additionally, we cannot
                control the actions of other users of the Website with whom you may choose to share
                your User Contributions. Therefore, we cannot and do not guarantee that your User
                Contributions will not be viewed by unauthorized persons.
              </p>
              <h6>Information We Collect Through Automatic Data Collection Technologies</h6>
              <p>
                As you navigate through and interact with our Website, we may use automatic data
                collection technologies to collect certain information about your equipment,
                browsing actions, and patterns, including:
              </p>
              <ul>
                <li>
                  Details of your visits to our Website, including traffic data, location data,
                  logs,]and other communication data and the resources that you access and use on
                  the Website.
                </li>
                <li>
                  Information about your computer and internet connection, including your IP
                  address, operating system, and browser type.
                </li>
              </ul>
              <p>
                We also may use these technologies to collect information about your online
                activities over time and across third-party websites or other online services. The
                information we collect automatically may include personal information. It helps us
                to improve our Website and to deliver a better and more personalized service,
                including by enabling us to:
              </p>
              <ul>
                <li>Estimate our audience size and usage patterns.</li>
                <li>
                  Store information about your preferences, allowing us to customize our Website
                  according to your individual interests.
                </li>
                <li>Speed up your searches.</li>
                <li>Recognize you when you return to our Website.</li>
              </ul>
              <p>The technologies we use for this automatic data collection may include:</p>
              <ul>
                <li>
                  <strong> Cookies (or browser cookies). </strong> A cookie is a small file placed
                  on the hard drive of your computer. You may refuse to accept browser cookies by
                  activating the appropriate setting on your browser. However, if you select this
                  setting you may be unable to access certain parts of our Website. Unless you have
                  adjusted your browser setting so that it will refuse cookies, our system will
                  issue cookies when you direct your browser to our Website.
                </li>
                <li>
                  <strong>Flash Cookies.</strong> Certain features of our Website may use local
                  stored objects (or Flash cookies) to collect and store information about your
                  preferences and navigation to, from, and on our Website. Flash cookies are not
                  managed by the same browser settings as are used for browser cookies. For
                  information about managing your privacy and security settings for Flash cookies,
                  see Choices About How We Use and Disclose Your Information.
                </li>
                <li>
                  <strong>Web Beacons.</strong> Pages of our Website may contain small electronic
                  files known as web beacons (also referred to as clear gifs, pixel tags, and
                  single-pixel gifs) that permit the Company, for example, to count users who have
                  visited those pages or and for other related website statistics (for example,
                  recording the popularity of certain website content and verifying system and
                  server integrity).
                </li>
              </ul>
              <h6>Third-Party Use of Cookies</h6>
              <p>
                Some content or applications, including advertisements, on the Website are served by
                third parties, including advertisers, ad networks and servers, content providers,
                and application providers. These third parties may use cookies to collect
                information about you when you use our website. The information they collect may be
                associated with your personal information or they may collect information, including
                personal information, about your online activities over time and across different
                websites and other online services. They may use this information to provide you
                with interest-based advertising or other targeted content. We do not control these
                third parties’ tracking technologies or how they may be used. If you have any
                questions about an advertisement or other targeted content, you should contact the
                responsible provider directly. For information about how you can opt out of
                receiving targeted advertising from many providers, see Choices About How We Use and
                Disclose Your Information.
              </p>
              <h6>How We Use Your Information</h6>
              <p>
                We use information that we collect about you or that you provide to us, including
                any personal information:
              </p>
              <ul>
                <li>To present our Website and its contents to you.</li>
                <li>
                  To provide you with information, products, or services that you request from us.
                </li>
                <li>To fulfill any other purpose for which you provide it.</li>
                <li>
                  To provide you with notices about your account including expiration and renewal
                  notices.
                </li>
                <li>
                  To carry out our obligations and enforce our rights arising from any contracts
                  entered into between you and us, including for billing and collection.
                </li>
                <li>
                  To notify you about changes to our Website or any products or services we offer or
                  provide though it.
                </li>
                <li>To allow you to participate in interactive features on our Website.</li>
                <li>In any other way we may describe when you provide the information.</li>
                <li>For any other purpose with your consent.</li>
              </ul>
              <p>
                We may also use your information to contact you about our own and third-parties’
                goods and services that may be of interest to you. If you do not want us to use your
                information in this way, please send us an email to support@uncommongood.io. For
                more information, see Choices About How We Use and Disclose Your Information.
              </p>
              <h6>Disclosure of Your Information</h6>
              <p>
                We may disclose aggregated information about our users without restriction. We may
                disclose personal information that we collect, or you provide as described in this
                privacy policy:
              </p>
              <ul>
                <li>
                  To contractors, service providers, business partners and other third parties we
                  use to support our business.
                </li>
                <li>
                  To a buyer or other successor in the event of a merger, divestiture,
                  restructuring, reorganization, dissolution, or other sale or transfer of some or
                  all of Uncommon Good’s assets, whether as a going concern or as part of
                  bankruptcy, liquidation, or similar proceeding, in which personal information held
                  by Uncommon Good about our Website users is among the assets transferred.
                </li>
                <li>To fulfill the purpose for which you provide it.</li>
                <li>For any other purpose disclosed by us when you provide the information.</li>
                <li>With your consent.</li>
              </ul>
              <p>We may also disclose your personal information:</p>
              <ul>
                <li>
                  To comply with any court order, law, or legal process, including to respond to any
                  government or regulatory request.
                </li>
                <li>
                  To enforce or apply our terms of use and other agreements, including for billing
                  and collection purposes.
                </li>
                <li>
                  If we believe disclosure is necessary or appropriate to protect the rights,
                  property, or safety of Uncommon Good, our customers, or others.
                </li>
              </ul>
              <h6>Choices About How We Use and Disclose Your Information</h6>
              <p>
                We strive to provide you with choices regarding the personal information you provide
                to us. We have created mechanisms to provide you with the following control over
                your information:
              </p>
              <ul>
                <li>
                  <strong> Tracking Technologies and Advertising. </strong> You can set your browser
                  to refuse all or some browser cookies, or to alert you when cookies are being
                  sent. If you disable or refuse cookies, please note that some parts of this site
                  may then be inaccessible or not function properly.
                </li>
                <li>
                  <strong> Disclosure of Your Information for Third-Party Advertising. </strong>
                  If you do not want us to share your personal information with unaffiliated or
                  non-agent third parties for promotional purposes, you can opt-out by sending us an
                  email with your request to support@uncommongood.io.
                </li>
                <li>
                  <strong>Promotional Offers from the Company. </strong>If you do not wish to have
                  your contact information used by the Company to promote our own or third parties’
                  products or services, you can opt-out by sending us an email stating your request
                  to support@uncommongood.io. If we have sent you a promotional email, you may send
                  us a return email asking to be omitted from future email distributions. We do not
                  control third parties’ collection or use of your information to serve
                  interest-based advertising. However, these third parties may provide you with ways
                  to choose not to have your information collected or used in this way. You can opt
                  out of receiving targeted ads from members of the Network Advertising Initiative
                  (”NAI”) on the NAI’s website.
                </li>
              </ul>
              <h6>Correcting Your Information</h6>
              <p>
                You may send us an email at support@uncommongood.io to request access to, correct or
                delete any personal information that you have provided to us. We may not accommodate
                a request to change information if we believe the change would violate any law or
                legal requirement or cause the information to be incorrect.
              </p>
              <h6>Data Security</h6>
              <p>
                We have implemented measures designed to secure your personal information from
                accidental loss and from unauthorized access, use, alteration, and disclosure. The
                safety and security of your information also depends on you. Where we have given you
                a password for access to certain parts of our Website, you are responsible for
                keeping this password confidential. We ask you not to share your password with
                anyone. We urge you to be careful about giving out information in public areas of
                the Website like message boards. The information you share in public areas may be
                viewed by any user of the Website. Unfortunately, the transmission of information
                via the internet is not completely secure. Although we do our best to protect your
                personal information, we cannot guarantee the security of your personal information
                transmitted to our Website. Any transmission of personal information is at your own
                risk. We are not responsible for circumvention of any privacy settings or security
                measures contained on the Website.
              </p>
              <h6>Changes to Our Privacy Policy</h6>
              <p>
                It is our policy to post any changes we make to our privacy policy on this page. If
                we make material changes to how we treat our users’ personal information, we will
                notify you by email to the primary email address specified in your account or
                through a notice on the Website home page. The date the privacy policy was last
                revised is identified at the top of the page. You are responsible for ensuring we
                have an up-to-date active and deliverable email address for you, and for
                periodically visiting our Website and this privacy policy to check for any changes.
              </p>
              <h6>Contact Information</h6>
              <p>
                To ask questions or comment about this privacy policy please contact us at:
                support@uncommongood.io
              </p>
              <h3>UNCOMMON GOOD TERMS OF SERVICE FOR</h3>
              <h3>SOFTWARE AND SERVICES OFFERED BY UNCOMMON GOOD, INC.</h3>
              <p>
                Please read these Terms carefully before You use our Website as they constitute a
                binding agreement between organizations and consumers (“Users” or “You” or “Your”)
                and Uncommon Good, Inc. (“Uncommon Good” or the “Company” or “We” or “Us”). The
                following terms and conditions, together with any documents they expressly
                incorporate by reference (collectively, "Terms of Use"), govern Your access to and
                use of www.uncommongood.io, including any content, functionality, applications, and
                services offered on or through www.uncommongood.io platform (the "Website"), whether
                as a guest or a registered User.
              </p>
              <h6>1. The Uncommon Good Website</h6>
              <p>
                Uncommon Good’s Website includes a web platform with services, software applications
                and links, third-party and otherwise, which offer data analytics, communications,
                campaign, organizational and donor management, marketing and branding, influencer
                and volunteer management, cause coalitions, auctions and sweepstakes tools and
                services to non-profit organizations. The Website also includes opportunities for
                consumers to learn about, support, and volunteer for non-profit organizations as
                well as engage with and promote non-profit organizations.
              </p>
              <h6>2. Third Party Providers</h6>
              <p>
                Uncommon Good’s Website may directly or indirectly feature certain third party
                providers (“Third Party Providers”), provide links to websites or applications and
                access to or integrations with content, products, services, utilities, software,
                hardware, systems, networks, connections, data, content, documents or other
                materials from third parties (“Third Party Materials”). User acknowledges and agrees
                that (a) access and use of Third Party Materials may be subject to additional terms
                and conditions as made available by such Third Party Providers and User shall comply
                with all obligations, relating to Third Party Providers and Third Party Materials
                under the terms of any agreement with such Third Party Providers and/or the
                providers of such Third Party Materials, (b) Company may, at any time in its
                discretion, modify, cancel or discontinue any available interoperability or
                integrations for the Company Products and Services with any Third Party Materials,
                or any other support or assistance provided by Company in connection with any Third
                Party Providers or Third Party Materials, and (c) Company is not responsible for the
                availability, quality or content of any such Third Party Materials or results
                related to your use of Third Party Materials. Further, you represent and warrant to
                Company that you shall agree to and comply with Third Party Providers’ terms and
                conditions.
              </p>
              <h6>3. Minors</h6>
              <p>
                Our Website is not intended for children under 13 years of age. Users who are under
                the age of 18 but over 13 years may use the website provided use is subject to
                parental supervision. No one under age 13 may use the site or provide any personal
                information on the Website. We do not knowingly collect personal information from
                children under 13. If we learn we have collected or received personal information
                from a child under 13 without verification of parental consent, we will delete that
                information. If you believe we might have any information from or about a child
                under 13, please contact us at info@uncommongood.io
              </p>
              <h6>4. Accessing the Website and Account Security</h6>
              <p>
                We reserve the right to withdraw or amend this Website, and any software
                applications, service or links to Third-Party Providers we offer on the Website, in
                our sole discretion without notice. We will not be liable if for any reason all or
                any part of links on the Website are unavailable at any time or for any period. From
                time to time, we may restrict access to some parts of the Website, or the entire
                Website, to Users, including registered Users. To access the Website or Third Party
                Materials, You may be asked to provide certain registration details or other
                information. It is a condition of Your use of the Website that all the information
                You provide on or through links on the Website is correct, current, and complete.
                You agree that all information You provide to register with this Website or
                otherwise, including, but not limited to, through the use of any interactive
                features on the Website, is governed by our
                <router-link to="/privacy-policy">Privacy Policy</router-link>, and You consent to
                all actions we take with respect to Your information consistent with our Privacy
                Policy.
              </p>
              <p>
                If You choose, or are provided with, a username, password, or any other piece of
                information as part of our security procedures, You must treat such information as
                confidential, and You must not disclose it to any other person or entity. You agree
                to notify us immediately of any unauthorized access to or use of Your Username or
                password or any other breach of security.
              </p>
              <p>
                We have the right and sole discretion to disable any Username, password, or other
                identifier, whether chosen by You or provided by us, at any time if, in our opinion,
                You have violated any provision of these Terms of Use.
              </p>
              <h6>5. Donations from Consumers to Nonprofit Organizations</h6>
              <p>
                Consumers may make one-time and/or recurring donations to nonprofit organizations
                selected from the Company’s Website. Consumer donations may be completed through a
                Third Party payment link which then are directed to the nonprofit organization’s
                Stripe account. The Stripe terms and conditions can be found (URL address). At no
                time does Company receive or have access to the donation funds. Transaction fees
                related to donations are incurred by the nonprfofit organization recipient of the
                donation. In addition, the consumer pays a credit card processing fee, the terms for
                which are set forth in the Stripe terms and conditions. Representations by
                non-profit organizations receiving donations from consumers: You are recognized by
                the Internal Revenue Service as exempt from federal income tax under IRC Section
                501(c)(3), and have public charity status under Section 509(a)(1) or (2), or under
                IRC Section 509(a)(3) if You are classified as a functionally integrated Type III
                supporting organization, and will utilize all donations received in accordance with
                such tax-exempt status.
              </p>
              <h6>6. Fees and Payment Terms</h6>
              <p>
                Fees charged by Company to non-profit organizations for use of the services on the
                Website, including Third Party Provider services, shall be listed on the Website.
              </p>
              <h6>7. Uncommon Good’s Intellectual Property</h6>
              <p>
                The Website and its entire contents, features, and functionality (including but not
                limited to all information, text, displays, images, video, and audio, and the
                design, selection, and arrangement thereof) are owned by the Company or other
                providers of such material and are protected by United States and international
                copyright, trademark, patent, trade secret, and other intellectual property or
                proprietary rights laws. These Terms of Use permit You to use the Website for Your
                personal, non-commercial use only.
              </p>
              <p>
                You must not reproduce, distribute, modify, create derivative works of, publicly
                display, publicly perform, republish, download, store, or transmit any of the
                material on our Website, except as follows: your computer may temporarily store
                copies of such materials in RAM incidental to Your accessing and viewing those
                materials; you may store files that are automatically cached by Your Web browser for
                display enhancement purposes; and if we provide social media features with certain
                content, You may take such actions as are enabled by such features. You must not
                modify copies of any materials from this site, or delete or alter any copyright,
                trademark, or other proprietary rights notices from copies of materials from this
                site. No right, title, or interest in or to the Website or any content on the
                Website is transferred to You, and all rights not expressly granted are reserved by
                the Company. Any use of the Website not expressly permitted by these Terms of Use is
                a breach of these Terms of Use and may violate copyright, trademark, and other law
                Trademarks - The Company name and the Company logo and all related names, logos,
                product and service names, designs, and slogans are trademarks of the Company or its
                affiliates. You must not use such marks without the prior written permission of the
                Company. All other names, logos, product and service names, designs, and slogans on
                this Website are the trademarks of their respective owners.
              </p>
              <h6>8. Prohibited Uses</h6>
              <p>
                You must use the Website and Services solely as permitted by these Terms of Use or
                as otherwise expressly agreed in writing by Uncommon Good. You agree that you will
                not (i) adapt, alter, modify, improve, translate, or create derivative works of the
                Platform or Services; (ii) attempt to access or download the technology used by the
                Company to provide the Services (other than as expressly provided by the Company to
                use the Platform) or reverse engineer, decompile, disassemble, or otherwise attempt
                to reconstruct or obtain the source code to all or any portion of the Platform;
                (iii) provide any third party access to or use of the Platform on behalf of any
                third party, including as part of a time-sharing, outsourcing or service bureau
                environment; (iv) transmit any file which contains viruses, worms, Trojan horses or
                any other contaminating or destructive features, or that otherwise interfere with
                the operation of the Platform; (v) attempt to test the vulnerability of the Website
                or network or circumvent any security or authentication measures protecting the
                Company Property; (vi) remove any proprietary notices or labels in documentation
                provided by the Company; (vii) use any Company property in any manner detrimental to
                the Company (including for the purpose of creating or improving any services or
                technology that performs similar functions or is competitive with the Company) or in
                any way that violates any applicable federal, state, local, or international law or
                regulation.
              </p>
              <h6>9. User Contributions</h6>
              <p>
                The Website may contain chat functions, biography pages for organizations, blog
                posts, forums, and other interactive features (collectively, "Interactive Services")
                that allow Users to post, submit, or transmit to other Users or other persons
                (hereinafter, "post") content or materials (collectively, "User Contributions") on
                or through the Website. All User Contributions must comply with the Content
                Standards set out in these Terms of Use. Any User Contribution You post to the site
                will be considered non-confidential and non-proprietary. By providing any User
                Contribution on the Website, You grant us and our respective successors, and assigns
                the right to use, reproduce, modify, perform, display, distribute, and otherwise
                disclose to third parties any such material. You understand and acknowledge that You
                are responsible for any User Contributions You submit or contribute, and You, not
                the Company, have full responsibility for such content, including its legality,
                reliability, accuracy, and appropriateness. We are not responsible or liable to any
                third party for the content or accuracy of any User Contributions posted by You or
                any other User of the Website. We have the right to remove or refuse to post any
                User Contributions for any or no reason in our sole discretion. We do not review all
                material before it is posted on the Website and cannot ensure prompt removal of
                objectionable material after it has been posted. Accordingly, we assume no liability
                for any action or inaction regarding transmissions, communications, or content
                provided by any User or third party.
              </p>
              <h6>10. Content Standards</h6>
              <p>
                Content Standards These content standards apply to any and all User Contributions.
                User Contributions must in their entirety comply with all applicable federal, state,
                local, and international laws and regulations. User Contributions must not contain
                any material that is defamatory, obscene, indecent, abusive, offensive, harassing,
                violent, hateful, inflammatory, or otherwise objectionable; promote sexually
                explicit or pornographic material, violence, or discrimination based on race, sex,
                religion, nationality, disability, sexual orientation, or age; infringe any patent,
                trademark, trade secret, copyright, or other intellectual property or other rights
                of any other person; violate the legal rights of others or contain any material that
                could give rise to any civil or criminal liability under applicable laws or
                regulations or that otherwise may be in conflict with these Terms of Use and our
                Privacy Policy; promote any illegal activity, or advocate, promote, or assist any
                unlawful act; cause annoyance, inconvenience, or needless anxiety or be likely to
                upset, embarrass, alarm, or annoy any other person; or impersonate any person or
                misrepresent Your identity or affiliation with any person or organization.
              </p>
              <h6>11. Copyright</h6>
              <p>
                Uncommon Good respects the intellectual property rights of others. If you believe
                your work has been copied in a way that constitutes copyright infringement, or your
                intellectual property rights have otherwise been violated, please provide a notice
                containing all of the following information to our Copyright Agent:
              </p>
              <ul>
                <li>
                  a. An electronic or physical signature of the person authorized to act on behalf
                  of the owner of the copyright or other intellectual property interest;
                </li>
                <li>b. A description of the copyrighted work that you claim has been infringed;</li>
                <li>
                  c. A description of where the material that you claim is infringing is located on
                  the Website;
                </li>
                <li>d. Your address, telephone number, and e-mail address;</li>
                <li>
                  e. A statement by you that you have a good faith belief that the disputed use is
                  not authorized by the copyright owner, its agent, or the law; and
                </li>
                <li>
                  f. A statement by you, made under penalty of perjury, that the above information
                  in your notice is accurate and that you are the copyright owner or authorized to
                  act on the copyright owner's behalf.
                </li>
              </ul>
              <p>
                Our Copyright Agent for Notice of claims of copyright infringement on the Website is
                [NAME] who can be reached as follows: By E-mail: info@uncommongood.io Linking to the
                Website and Social Media You may link to our Website, provided you do so in a way
                that is fair and legal and does not damage our reputation or take advantage of it,
                but you must not establish a link in such a way as to suggest any form of
                association, approval, or endorsement on our part without our express written
                consent. We may provide certain features that enable you to (i) link from your own
                or certain third-party websites to certain content on the Platform, (ii) send
                emails, texts, or other communications with certain content, or links to certain
                content, on the Platform, and (iii) cause limited portions of content on this
                Platform to be displayed or appear to be displayed on your own or certain
                third-party websites. You may use these features solely as they are provided by us
                and with respect to the content they are displayed with, and in a manner consistent
                with the other provisions of these Terms of Use. We reserve the right to disable all
                or any social media features and any links at any time without notice in our
                discretion.
              </p>
              <h6>12. Geographic Restrictions</h6>
              <p>
                We provide this Website for use only by persons located in the United States. We
                make no claims that the Website or any of its content is accessible or appropriate
                outside of the United States. If You access the Website from outside the United
                States, You do so on Your own initiative and are responsible for compliance with
                local laws.
              </p>
              <h6>13. Disclaimer of Warranties</h6>
              <p>
                You understand that we cannot and do not guarantee or warrant that applications
                available on our Website will be free of viruses or other destructive code. You are
                responsible for implementing sufficient procedures and checkpoints to satisfy Your
                particular requirements for anti-virus protection and accuracy of data input and
                output, and for maintaining a means external to our site for any reconstruction of
                any lost data.
              </p>
              <p>
                TO THE FULLEST EXTENT PROVIDED BY LAW, WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE
                CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES, OR OTHER TECHNOLOGICALLY
                HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA,
                OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE WEBSITE, THIRD PARTY MATERIALS,
                OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE OR THIRD PARTY MATERIALS OR
                LINKS.
              </p>
              <p>
                YOUR USE OF THE WEBSITE, ITS CONTENT, THIRD PARTY MATERIALS AND LINKS AND ANY
                SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE IS AT YOUR OWN RISK. THE WEBSITE, ITS
                CONTENT, THIRD PARTY LINKS AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE
                ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED. NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH
                THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS,
                SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE WEBSITE. WITHOUT
                LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY
                REPRESENTS OR WARRANTS THAT THE WEBSITE, ITS CONTENT, OR ANY SERVICES OR ITEMS
                OBTAINED THROUGH THE WEBSITE WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR
                UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR SITE OR THE SERVER THAT
                MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT THE
                WEBSITE OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE WILL OTHERWISE MEET
                YOUR NEEDS OR EXPECTATIONS.
              </p>
              <p>
                TO THE FULLEST EXTENT PROVIDED BY LAW, THE COMPANY HEREBY DISCLAIMS ALL WARRANTIES
                OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT
                LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR
                PARTICULAR PURPOSE.
              </p>
              <p>
                THE FOREGOING DOES NOT AFFECT ANY WARRANTIES THAT CANNOT BE EXCLUDED OR LIMITED
                UNDER APPLICABLE LAW.
              </p>
              <h6>14. Limitation on Liability</h6>
              <p>
                TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL COMPANY, ITS AFFILIATES, OR
                THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE
                LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN
                CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE AND SERVICES, ANY THIRD
                OR SUCH PARTY MATERIALS LINKED TO THEM, AND ANY CONTENT WEBSITES, INCLUDING ANY
                DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
                BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF
                REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS
                OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH
                OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
              </p>
              <p>
                THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER
                APPLICABLE LAW.
              </p>
              <h6>15. Indemnification</h6>
              <p>
                You agree to defend, indemnify, and hold harmless the Company, its affiliates, and
                service providers, and its and their respective officers, directors, employees,
                contractors, agents, suppliers, successors, and assigns from and against any claims,
                liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including
                reasonable attorneys' fees) arising out of or relating to Your violation of these
                Terms of Use or Your use of the Website, including, but not limited to, Your User
                Contributions, any use of the Website's content, services, and products other than
                as expressly authorized in these Terms of Use, or Your use of any information
                obtained from the Website.
              </p>
              <h6>16. Governing Law and Jurisdiction</h6>
              <p>
                These Terms of Use, and any dispute or claim arising therefrom or related thereto,
                shall be governed by and construed in accordance with the internal laws of the State
                of Connecticut without giving effect to any choice or conflict of law provision or
                rule. Any legal suit, action, or proceeding arising out of, or related to, these
                Terms of Use or the Website shall be instituted exclusively in the federal courts of
                the United States or the courts of the State of Connecticut, in each case located in
                the County of Fairfield. You waive any and all objections to the exercise of
                jurisdiction over You by such courts and to venue in such courts.
              </p>
              <h6>17. Waiver and Severability</h6>
              <p>
                No waiver by the Company of any term or condition set out in these Terms of Use
                shall be deemed a further or continuing waiver of such term or condition or a waiver
                of any other term or condition, and any failure of the Company to assert a right or
                provision under these Terms of Use shall not constitute a waiver of such right or
                provision. If any provision of these Terms of Use is held by a court or other
                tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any
                reason, such provision may be limited to the minimum extent such that the remaining
                provisions of the Terms of Use will continue in full force and effect.
              </p>
              <h6>18. Changes to the Website and Terms of Use</h6>
              <p>
                We may revise and update the Website and these Terms of Use from time to time in our
                sole discretion. All changes are effective immediately when we post them. Your
                continued use of the Website following the posting of revised Terms of Use means
                that You accept and agree to the changes. You are expected to check this page from
                time to time so You are aware of any changes, as they are binding on You.
              </p>
              <h6>19. Entire Agreement</h6>
              <p>
                The Terms of Use, and our Privacy Policy, constitute the sole and entire agreement
                between You and Uncommon Good, Inc. regarding the Website and supersede all prior
                and contemporaneous understandings, agreements, representations, and warranties,
                both written and oral, regarding the Website.
              </p>
              <h6>20. Your Comments and Concerns</h6>
              <p>
                This website is operated by Uncommon Good, Inc. All feedback, comments, requests for
                technical support, and other communications relating to the Website should be
                directed to: info@uncommongood.io
              </p>
            </div>
          </div>
          <div class="modal_btn" v-if="actions">
            <a href="" class="btn btn-white btn-small btn-img" @click.prevent="print"
              ><img :src="require(`@/assets/img/print.svg`)" />Print</a
            >
            <a
              href=""
              class="btn btn-yellow btn-small"
              @click.prevent="
                $emit('accept')
                $emit('hideModal')
              "
              >Accept</a
            >
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'modal',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    actions: { type: Boolean, default: false },
  },
  data() {
    return {
      output: null,
    }
  },
  methods: {
    print() {
      this.$htmlToPaper('printMe')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed !important;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: #fbfbfb;
  opacity: 1;
  cursor: pointer;
  padding: 4rem;
  @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
    padding: 2rem;
  }
  &_background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    cursor: pointer;
  }
  .modal {
    position: relative;
    width: 100%;
    max-width: 940px;
    max-height: calc(100vh - 8rem);
    box-shadow: 0px 0px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 10px;
    background: #fff;
    padding: 4rem;
    z-index: 999;
    @media only screen and (max-width: 1399px) {
      padding: 3rem;
    }
    @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
      max-height: calc(100vh - 4rem);
      padding: 2rem 2.5rem 2rem 2rem;
    }
    span.close {
      position: absolute;
      right: 4rem;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid #f3f3f3;
      border-radius: 8px;
      @media only screen and (max-width: 1399px) {
        width: 30px;
        height: 30px;
        right: 3rem;
      }
      @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
        width: 25px;
        height: 25px;
        right: 2.5rem;
      }
      img {
        width: 30px;
      }
    }
    &_header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 2rem;
      border-bottom: 1px solid #f2eef9;
      margin-bottom: 3rem;
      @media only screen and (max-width: 1399px) {
        padding-bottom: 1.5rem;
        margin-bottom: 2rem;
      }

      h4 {
        color: $violet;
      }
    }
    &_content {
      max-height: 60vh;
      overflow-y: auto;
      margin-bottom: 20px;
      padding-right: 15px;
      h3 {
        font-size: 20px;
        font-weight: 700;
        color: $violet;
        text-align: center;
        margin-bottom: 30px;
        text-transform: uppercase;
        &:last-of-type {
          margin-bottom: 40px;
        }
      }
      p {
        font-size: 16px;
        line-height: 1.2;
        font-weight: 400;
        color: $violet;
        margin-bottom: 15px;
        a {
          color: $textLightBlue;
          font-weight: 600;
          text-decoration: underline;
          &:hover {
            color: $green;
          }
        }
      }
      h6 {
        font-size: 16px;
        line-height: 1.2;
        font-weight: 700;
        color: $violet;
        margin-bottom: 15px;
        text-decoration: underline;
      }
      ul {
        padding: 10px 0;
        li {
          list-style: disc;
          margin: 0 0 15px 25px;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 500;
          color: $violet;
        }
      }
    }
    &_btn {
      display: flex;
      justify-content: flex-end;
      @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
        justify-content: center;
      }
      .btn {
        margin: 0 0 0 3rem;
        @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
          margin: 0 1rem;
        }
      }
    }
  }
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-to {
  transition-delay: 0.3s;
}

.pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}
.pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.2s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-50%, -50%);
}
</style>
