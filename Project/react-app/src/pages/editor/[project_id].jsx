import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingDisplay from '@/components/PreviewLoading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


const Editor = dynamic(
    () => import('@/ClientSidePages/Editor'),
    {
        ssr: false,
        loading: () => <LoadingDisplay fun />,
    }
);


export default function Page() {
    const session = useSession();
    const [projectData, setProjectData] = React.useState({});

    const router = useRouter();

    const { project_id } = router.query;

    //This change either made my code way more resilient or way less resilient
    //Right now this works because the files are loaded before the editor is rendered
    //If the editor is rendered before the files are loaded, it may crash
    //We'll see
    useEffect(() => {
        if (project_id && session.data) {
            const getProject = async () => {
                console.log(session.data)
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${project_id}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${session.data.token}`,
                    }
                })
                const data = await response.json().then((data) => {
                    return data;
                })
                console.log(data)
                setProjectData(data)
            }
            getProject()
        }
    }, [project_id, session])

    return <Editor project_in={projectData} />
    // return <LoadingDisplay fun />
}
