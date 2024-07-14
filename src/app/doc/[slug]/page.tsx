  "use client"
  import React, { FC, useEffect, useState } from 'react';
  import { allDocs } from '../../../../.contentlayer/generated';
  import { notFound } from 'next/navigation';
  import { Mdx } from '../../../components/mdx-components';
  import { DocsSidebarNav, DocsSidebarNavItems } from '../../../components/sidebar-nav';
  import { SidebarNavItem } from '../../../types/index.s';
  import IntroNav from '../../../components/intronav';
  import { parseMarkdownHeadings } from '../../../lib/parseHeading';
  import Navbar from '@/components/navbar';

  interface PageProps {
    params: {
      slug: string;
    };
  }

  async function getDocFromParams(slug: string) {
    const doc = allDocs.find((doc: { slugAsParams: string }) => doc.slugAsParams === slug);
    if (!doc) {
      notFound();
      return null;
    }
    return doc;
  }

  const Page: FC<PageProps> = ({ params }) => {
    const [doc, setDoc] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [markdownContent, setMarkdownContent] = useState<string>(''); 
    const [sidebarHead, setSidebarHead] = useState<SidebarNavItem[]>([]);

    useEffect(() => {
      const fetchDoc = async () => {
        try {
          const fetchedDoc = await getDocFromParams(params.slug);
          if (!fetchedDoc) {
            throw new Error('Document not found');
          }
          setDoc(fetchedDoc);
          setMarkdownContent(fetchedDoc.body.code); 

          
          const headings = parseMarkdownHeadings(fetchedDoc.body.raw);
          const sidebarHeadItems = headings.map((heading) => ({
            title: heading.text,
            href: `#${heading.text.toLowerCase().replace(/\s+/g, '-')}`,
          }));
          setSidebarHead(sidebarHeadItems);
        } catch (error) {
          console.error('Error fetching document:', error);
          setDoc(null);
          notFound();
        } finally {
          setLoading(false);
        }
      };

      fetchDoc();
    }, [params.slug]);

    if (loading || !doc) {
      return <div>Loading...</div>;
    }

    
    const sidebarItems: SidebarNavItem[] = allDocs.map((doc) => ({
      title: doc.slugAsParams.replace(/-/g, ' '),
      href: `/${doc.slugAsParams}`,
    }));

    return (
      <main className="">
        <Navbar/>
        <div className="sidebar">
          <IntroNav markdownContent={markdownContent} />
          <div>
            <div style={{ background: "black", width: "18%", height: "100%", position: "fixed", top: "10%",paddingLeft:"16rem",}}>
              <DocsSidebarNav items={sidebarItems} />
            </div>
          </div>
        </div>
        <div className="content" >
          <Mdx code={doc.body.code} />
        </div>
        <div className='head' style={{ position: "fixed", top: "10%", left: "85%", background: "", width: "15%", height: "15%", borderRadius: "5%" }}>
          <DocsSidebarNavItems items={sidebarHead} pathname="hello" />
        </div>
      </main>
    );
  };

  export default Page;
