/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.pm.PackageManager;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

//import androidx.annotation.NonNull;
// import androidx.core.app.ActivityCompat;
// import androidx.core.content.ContextCompat;

// import com.cocos.lib.CocosHelper;
// import com.cocos.lib.CocosJavascriptJavaBridge;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;


public class ImageUtils {
    private AppActivity appActivity = null;
    private final int REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE = 1;
    private String imageData;

    public void saveImageToPhotoLibrary(AppActivity appActivity, String imageData) {
        try {
            // Decode the Base64 string into a byte array
            byte[] decodedImageData = Base64.decode(imageData, Base64.DEFAULT);

            // Save the image to the photo library
            ContentResolver contentResolver = appActivity.getContentResolver();
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
            Uri imageUri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

            if (imageUri != null) {
                FileOutputStream fos = (FileOutputStream) contentResolver.openOutputStream(imageUri);
                fos.write(decodedImageData);
                fos.close();
            }

            Log.d("ImageUtils", "Image saved to photo library");
            // CocosHelper.runOnGameThread(new Runnable() {
            //     @Override
            //     public void run() {
            //         CocosJavascriptJavaBridge.evalString("saveImageToPhotoLibrary(1)");
            //     }
            // });
        } catch (IOException e) {
            // CocosHelper.runOnGameThread(new Runnable() {
            //     @Override
            //     public void run() {
            //         CocosJavascriptJavaBridge.evalString("saveImageToPhotoLibrary(0)");
            //     }
            // });
            e.printStackTrace();
        }
    }
    // public void saveImageToPhotoLibraryBackup(AppActivity appActivity, String imageData) {
    //     this.appActivity = appActivity;
    //     // Check if WRITE_EXTERNAL_STORAGE permission is granted
    //     if (ContextCompat.checkSelfPermission(this.appActivity,
    //             Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
    //         System.out.println("Permission is not granted, request it from the user");
    //         // Permission is not granted, request it from the user
    //         ActivityCompat.requestPermissions(this.appActivity,
    //                 new String[] { Manifest.permission.WRITE_EXTERNAL_STORAGE },
    //                 this.REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);

    //         // Save the image data to be used after permission is granted
    //         this.imageData = imageData;
    //         return;
    //     }

    //     // Permission is granted, proceed to save the image
    //     System.out.println("Permission is granted, proceed to save the image");
    //     this.saveImage(imageData);
    // }

    // private void saveImage(String imageData) {
    //     try {
    //         // Decode the Base64 string into a byte array
    //         byte[] decodedImageData = Base64.decode(imageData, Base64.DEFAULT);
    //         // Save the image to the gallery
    //         File directory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
    //         // Generate a unique filename using UUID
    //         String fileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + ".png";
    //         File imagePath = new File(directory, fileName);

    //         Log.d("imagePath", imagePath.getAbsolutePath());

    //         FileOutputStream fos = new FileOutputStream(imagePath);
    //         fos.write(decodedImageData);
    //         fos.close();

    //         // Refresh the gallery
    //         MediaScannerConnection.scanFile(this.appActivity,
    //                 new String[] { imagePath.getAbsolutePath() },
    //                 null,
    //                 (path, uri) -> {
    //                     Log.i("ImageUtils", "Scanned " + path + ":");
    //                     Log.i("ImageUtils", "-> uri=" + uri);
    //                 });
    //         CocosHelper.runOnGameThread(new Runnable() {
    //             @Override
    //             public void run() {
    //                 CocosJavascriptJavaBridge.evalString("saveImageToPhotoLibrary(1)");
    //             }
    //         });
    //     } catch (IOException e) {
    //         e.printStackTrace();
    //     }
    // }

    // Handle permission request result
//    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
//                                           @NonNull int[] grantResults) {
//        System.out.println(requestCode);
//        System.out.println(grantResults);
//        if (requestCode == REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE) {
//            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                // Permission granted, proceed to save the image
//                System.out.println("Permission granted, proceed to save the image");
//                saveImage(this.imageData); // Call the method to save the image
//            } else {
//                // Permission denied, show a message or handle the situation accordingly
//                System.out.println("Permission denied, show a message or handle the situation accordingly");
//                CocosHelper.runOnGameThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        CocosJavascriptJavaBridge.evalString("saveImageToPhotoLibrary(0)");
//                    }
//                });
//            }
//        }
//    }
}