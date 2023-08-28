import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import style from './Three.module.css';

const Three = () => {

    const canvasRef = useRef(null);


    useEffect(() => {

        
        const scene = new THREE.Scene();
        const loader = new GLTFLoader();

        
        loader.load('DinklageLikenessSculpt.glb', (gltf) => {
            const model = gltf.scene; // The loaded model

            // Adjust the position and scale of the model
            model.position.set(0, 0, 0);
            // model.scale.set(1.2, 1.2, 1.2);
            // model.rotation.set(0, Math.PI / 4, 0);

            scene.add(model);


            const target = new THREE.Vector3(0, 0, 0);



            const updateLookAt = (event) => {
                if (model && canvasRef.current) {
                    const canvasRect = canvasRef.current.getBoundingClientRect();
                    const cursorX = (event.clientX - canvasRect.left) / canvasRect.width * 2 - 1;
                    const cursorY = -(event.clientY - canvasRect.top) / canvasRect.height * 2 + 1;

                    // Use the cursor position to update the lookAt target
                    target.set(cursorX, cursorY, 1);
                    model.lookAt(target);
                }
            };

            // Listen for mousemove events to update the lookAt direction
            window.addEventListener('mousemove', updateLookAt);

            // Clean up the event listener when the component unmounts
            return () => {
                window.removeEventListener('mousemove', updateLookAt);
            };


            

        });


        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const light = new THREE.AmbientLight(0x404040);
        scene.add(light);

        // Add a directional light (sunlight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
        directionalLight.position.set(-30, -80, 0); // Adjust the position of the sunlight
        scene.add(directionalLight);

        // Add a point light
        const pointLight = new THREE.PointLight(0xff0000, 10);
        pointLight.position.set(-2, 7, 0); // Adjust the position of the point light
        scene.add(pointLight);

        // Add a spotlight
        const spotlight = new THREE.SpotLight(0x00ff00, 15);
        spotlight.position.set(-2, 2, 0); // Adjust the position of the spotlight
        spotlight.angle = Math.PI / 8; // Set the spotlight cone angle
        scene.add(spotlight);


        const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100);
        camera.position.z = 1;

        scene.add(camera);



        const canvas = document.querySelector('.webgl');
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(size.width, size.height);
        renderer.render(scene, camera);


        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = false;
        controls.enableZoom = false;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

    }, []);

    return (
        <>
        <canvas className='webgl' ref={canvasRef}></canvas>
        <div className={style.laptop}>
            <img src="https://purepng.com/public/uploads/large/apple-mac-vgn.png" />
        </div>
        </>
        
    );
}

export default Three;
