import TrackItem from '@/components/Track';
import { Track } from '@/utils/types';
import axios from 'axios';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const track: Track = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tracks/${params.id}`)).data;
    return { title: track.name, description: `Posted by ${track.author.login}` };
  } catch (err: any) {
    console.error(err);
    return { title: 'Track not found', description: 'Track has been deleted or never existed' };
  }
};

const Track = async ({ params }: Props) => {
  let track: Track | null = null;

  try {
    track = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tracks/${params.id}`)).data;
  } catch (err: any) {
    console.error(err);
  }

  return track ? <TrackItem track={track} /> : <h1>Track does not exist</h1>;
};

export default Track;
