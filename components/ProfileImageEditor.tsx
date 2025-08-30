"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { X, Upload, Save } from "lucide-react";
 import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
interface Crop {
  x: number;
  y: number;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function ProfileImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
    const supabase = createClient() 
    
    const {user}= useAuth()
    
  const onCropComplete = useCallback(
    (_: Crop, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

const showCroppedImage = useCallback(async () => {
  if (!croppedAreaPixels || !image) return;
  if (!user) {
    console.error("No logged-in user, cannot upload avatar");
    return;
  }

  try {
    const { file, url } = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(url); // preview

    // 👉 Upload to Supabase (namespaced by user.id)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${user.id}/${file.name}`, file, { upsert: true });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${user.id}/${file.name}`);

    const publicUrl = publicUrlData.publicUrl;

    console.log("Uploaded avatar URL:", publicUrl);

    // 👉 Update user profile in DB
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("DB update error:", updateError.message);
    }
  } catch (e) {
    console.error("Crop failed:", e);
  }
}, [image, croppedAreaPixels, user, supabase]);

    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setCroppedImage(null);
      setIsCropping(true); // open cropper modal
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Upload Button */}
      <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
        <Upload size={18} />
        <span>Upload Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview */}
      {croppedImage && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={croppedImage}
            alt="Cropped preview"
            className="w-40 h-40 rounded-full object-cover shadow-md"
          />
          <button
            onClick={showCroppedImage}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      )}

      {/* Cropper Modal */}
      {isCropping && image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-[90vw] max-w-lg h-[90vh] max-h-[500px] bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setIsCropping(false)}
              className="absolute top-3 right-3 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
            >
              <X size={20} />
            </button>

            {/* Cropper */}
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

            {/* Save Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={showCroppedImage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                <Save size={18} />
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
