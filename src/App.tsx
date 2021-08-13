import { useState } from 'react';
import Router from './router';
import { Canvas } from '@react-three/fiber'
import { animated, useSpring } from "@react-spring/three"
import { 
  BufferGeometry, 
  Material, 
  MeshBasicMaterial, 
  Texture, 
  FrontSide, 
  VideoTexture, 
  BoxBufferGeometry 
} from 'three';

type BoxProps = {
  onClick: () => void,
  'position-x': any,
  'position-y': any,
  'position-z': any,
}


const createCacheHook = <Data,>() => {
  const cache: Record<string, Data> = {};
  return (id: string, ctor: () => Data ): Data => {
    if( cache[id] === undefined ){
      cache[id] = ctor();
    }
    return cache[id];
  }
}

const useSharedGeometry = createCacheHook<BufferGeometry>();
const useSharedMaterial = createCacheHook<Material>();
const useSharedTexture = createCacheHook<Texture>();

const Box = (meshProps: BoxProps) => {
  const texture = useSharedTexture("box-texture", () => {
    const $video = document.createElement("video");
    $video.src = "/test.mp4";
    $video.loop = true;
    $video.muted = true;
    $video.play();
    return new VideoTexture($video)
  })
  const material = useSharedMaterial("box-material", () => new MeshBasicMaterial({ map: texture, side: FrontSide, toneMapped: false }))
  const geometry = useSharedGeometry("box-geometry", () => new BoxBufferGeometry(16, 12, 1))

  return <animated.mesh 
    {...meshProps} 
    geometry={geometry}
    material={material}
  >
  </animated.mesh>
}

const Juan = ({ next }: { next: () => void }) => {
  const [toggle, setToggle] = useState(false)
  
  const { x } = useSpring({ to: { x: toggle ? 1 : 0 }, onRest: next })

  const doTheThing = () => setToggle(true)

  return <Box 
    onClick={doTheThing} 
    position-x={x.to([0,1],[-10,10])}
    position-y={0}
    position-z={0}
  />
}

const Two = ({ next }: { next: () => void }) => {

  const [toggle, setToggle] = useState(false)
  
  const { x } = useSpring({ to: { x: toggle ? 1 : 0 }, onRest: next })

  const doTheThing = () => setToggle(true)

  return <Box 
    onClick={doTheThing} 
    position-x={x.to([0,1],[10,-10])}
    position-y={0}
    position-z={0}
  />
}

function App() {
  const [currentRoute, setRoute] = useState("juan")

  const switchRoute = () => {
    setRoute(prev => prev === "juan" ? "two" : "juan" )
  }

  return (
    <div style={{width: "90vw", height: "90vh"}}>
    <Canvas
      camera={{ position: [0,0,45] }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Router route={currentRoute}>
        <Router.Route path="juan">
          <Juan next={switchRoute} />
        </Router.Route>
        <Router.Route path="two">
          <Two next={switchRoute} />
        </Router.Route>
      </Router>
    </Canvas>
    </div>
  );
}

export default App;
