import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// Step 1: Component to Load and Rotate the GLB Model
// ----------------------------------------------------

/**
 * Loads the GLB model and applies continuous rotation.
 * @param {string} glbPath - The path to your .glb file.
 * @param {string} themeColor - The color derived from the theme props.
 */
function RotatingModel({ glbPath }) {
    // Reference to the 3D object to manipulate it directly
    const modelRef = useRef();
    
    // Load the 3D model (ensure your glb file is in the public folder)
    // NOTE: Replace '/path/to/your/model.glb' with the correct path to your file
    const { scene } = useGLTF('/genesis_logo.glb');

    // useFrame is R3F's animation loop hook, similar to requestAnimationFrame
    useFrame((state, delta) => {
        if (modelRef.current) {
            // Replicating a smooth, continuous rotation animation
            modelRef.current.rotation.y += delta * 0.15;
        }
    });
    



    return (
        // The primitive component renders the loaded 3D scene graph
        <primitive 
            object={scene} 
            ref={modelRef} 
            scale={0.8} // Adjust scale if the model is too big or small
            position={[0, 0, 0]} // Center the model
        />
    );
}

// ----------------------------------------------------
// Step 2: Main Component to Render the 3D Scene (Canvas)
// ----------------------------------------------------

// This replaces your original MatrixCube component
const MatrixModel = ({ color = "green", size = 280, glbPath = "/genesis_logo.glb" }) => {
    const themes = {
        green: { color: "#22c55e", background: "#051208" }, // tailwind green-500
        purple: { color: "#000000ff", background: "#15081f" }, // tailwind purple-500
    }
    const activeTheme = themes[color] || themes.green;
    
    // Define the style object for the container size
    const containerStyle = { 
        width: 1000, 
        height: 900, 
        // Replicating the shadow effect from the original CSS cube container
        boxShadow: `0 0 30px ${activeTheme.color}33`, 
        borderRadius: '8px'
    };

    return (
        <div 
            className="relative flex items-center justify-center perspective-[1200px] overflow-hidden" 
            style={containerStyle}
        >
            <Canvas 
                camera={{ position: [0, 0, 0.7], fov: 75 }}
                // style={{ background: activeTheme.background }}
                // 1. Set the Canvas style to transparent
                style={{ background: 'transparent' }} 
                
                // 2. Enable the WebGL renderer's alpha channel
                gl={{ 
                    outputColorSpace: THREE.SRGBColorSpace,
                    alpha: true // 👈 This is key for transparency
                }}
            >
                {/* Lighting and Environment */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                
                {/* Environment for realistic reflections and lighting */}
                <Environment preset="night" />

                {/* The Rotating 3D Model */}
                <RotatingModel glbPath={glbPath}  />
                
                {/* Optional: Add orbit controls for user interaction (drag to move camera) */}
                <OrbitControls enableZoom={false}  enablePan={false} autoRotate={true} autoRotateSpeed={2} />
                
            </Canvas>
        </div>
    );
}

export default MatrixModel;