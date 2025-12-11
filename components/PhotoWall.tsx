import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { DoubleSide, Vector3, Group, Mesh, Texture } from 'three';
import { useStore } from '../store';
import { FULL_PHOTO_LIST } from '../constants';
import gsap from 'gsap';

const RADIUS = 14;

const PhotoItem = ({ url, index, total, setHovered }: any) => {
    const texture = useTexture(url) as Texture;
    const groupRef = useRef<Group>(null);
    const { phase, activePhotoIndex, setActivePhotoIndex } = useStore();
    const [isLandscape, setIsLandscape] = useState(false);
    
    useLayoutEffect(() => {
        if(texture.image) {
            const img = texture.image as HTMLImageElement;
            setIsLandscape(img.width > img.height);
        }
    }, [texture]);

    const angle = (index / total) * Math.PI * 2;
    const basePos = new Vector3(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS);
    
    useFrame((state) => {
        if(!groupRef.current) return;
        
        if (phase !== 'nebula') {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        const isFocused = activePhotoIndex === index;
        
        groupRef.current.lookAt(0, 0, 0);
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5;

        if (isFocused) {
            groupRef.current.scale.lerp(new Vector3(1.5, 1.5, 1.5), 0.1);
        } else {
            groupRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
        }
    });

    return (
        <group 
            ref={groupRef} 
            position={basePos} 
            onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(index === activePhotoIndex ? null : index);
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[isLandscape ? 4 : 3, isLandscape ? 3.5 : 4, 0.1]} />
                <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.06, 0.2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[isLandscape ? 3.6 : 2.6, isLandscape ? 2.6 : 2.6]} />
                <meshBasicMaterial map={texture} side={DoubleSide} />
            </mesh>
        </group>
    );
};

const PhotoWall: React.FC = () => {
    const groupRef = useRef<Group>(null);
    const { phase, activePhotoIndex } = useStore();
    const [hovered, setHovered] = useState(false);
    
    // Rotation Logic
    const rotationVelocity = useRef(0);
    const isDragging = useRef(false);
    const previousPointerX = useRef(0);
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;
        
        const handleDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
            if (phase !== 'nebula') return;
            isDragging.current = true;
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            previousPointerX.current = clientX;
        };

        const handleMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
            if (!isDragging.current || phase !== 'nebula') return;
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const delta = clientX - previousPointerX.current;
            previousPointerX.current = clientX;
            
            // Adjust sensitivity
            rotationVelocity.current += delta * 0.005;
        };

        const handleUp = () => {
            isDragging.current = false;
        };

        // Attach to window to catch drags outside canvas
        window.addEventListener('pointerdown', handleDown);
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        window.addEventListener('touchstart', handleDown);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('pointerdown', handleDown);
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('touchstart', handleDown);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [gl, phase]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        if (phase === 'nebula') {
            if (activePhotoIndex === null) {
                // Apply friction
                rotationVelocity.current *= 0.95;
                
                // Idle rotation if not dragging and velocity low
                if(!isDragging.current && Math.abs(rotationVelocity.current) < 0.001) {
                    rotationVelocity.current = 0.05; // slight idle spin
                }
                
                groupRef.current.rotation.y += rotationVelocity.current * delta * 5; 
            }
             groupRef.current.scale.lerp(new Vector3(1,1,1), 0.1);
        } else {
            groupRef.current.scale.lerp(new Vector3(0,0,0), 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            {FULL_PHOTO_LIST.map((url, i) => (
                <PhotoItem 
                    key={i} 
                    url={url} 
                    index={i} 
                    total={FULL_PHOTO_LIST.length} 
                    setHovered={setHovered}
                />
            ))}
        </group>
    );
};

export default PhotoWall;