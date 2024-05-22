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


import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;

import android.util.Log;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.ClipData;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.WindowManager;
import android.content.pm.ActivityInfo;
import android.widget.Toast;
import android.content.Intent;
import android.content.res.Configuration;
import android.provider.Settings;
import java.io.File;
import java.io.FileWriter;

public class AppActivity extends Cocos2dxActivity {
    private static Context mContext;
    private static AppActivity act;
    private ImageUtils imageUtils = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        act = this;
        act.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        mContext = this;
        imageUtils = new ImageUtils();
    }

    public static String getIdentifier(){
        return Settings.Secure.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
    }
    public static String getDeviceName(){
        return android.os.Build.MANUFACTURER + android.os.Build.MODEL;
    }
    
    public static void makePhoneCall(String phone){
        Intent callIntent = new Intent(Intent.ACTION_DIAL);  
        callIntent.setData(Uri.parse("tel:" + phone));
        act.startActivity(callIntent);  
    }

    public static String getBundleid(){
        return mContext.getPackageName();
    }

    public static String getClipboardContent(){
        // Gets a handle to the clipboard service.
        ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
        String pasteData = "";
        try {
            pasteData = clipboard.getText().toString();;
            // Log.v("ClipboardManager", pasteData);
            return  pasteData;
        }catch (Exception ex){
            Log.v("ClipboardManager", ex.toString());
            return  "";
        }
    }

    public static void createFileeee(){
        //write file to internal storage on Android
        writeFileOnInternalStorage("example.txt", "SAKJDHSAKJDHSJK");
    }

    public static void writeFileOnInternalStorage(String sFileName, String sBody){
        try {
            File gpxfile = new File(mContext.getFilesDir(), sFileName);
            Log.i("FILE: ", gpxfile.getAbsolutePath());

            FileWriter writer = new FileWriter(gpxfile);
            writer.append(sBody);
            writer.flush();
            writer.close();
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void setClipboardContent(String text){
        // Gets a handle to the clipboard service.
        ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
        try {
            ClipData clip = ClipData.newPlainText("", text);
            clipboard.setPrimaryClip(clip);
        }catch (Exception ex){
            Log.v("ClipboardManager", ex.toString());
        }
    }

    //0: portrait up
    //1:landscape right
    //2: upside down
    //3:landscape left
    public static void setOrientation(int orientation){
        switch (orientation){
            case 0:
            case 2:
                act.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        act.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    }
                });
                // mActivity.runOnUiThread(()->mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT));
                break;
            case 1:
            case 3:
                act.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        act.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    }
                });
                break;
                // mActivity.runOnUiThread(()->mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE));
        }
    }

    // public static void setKeepScreenOn(boolean value){
    //     if(value){
    //         act.runOnUiThread(new Runnable() {
    //             @Override
    //             public void run() {
    //                 act.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    //             }
    //         });
    //         // act.runOnUiThread(()->act.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON));
    //     }else{
    //         act.runOnUiThread(new Runnable() {
    //             @Override
    //             public void run() {
    //                 act.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    //             }
    //         });
    //         // act.runOnUiThread(()->act.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON));
    //     }
    // }

    public static void saveImageToPhotoLibrary(String imageData) {
        act.imageUtils.saveImageToPhotoLibrary(act, imageData);
    }

    // Handle permission request result
    // public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
    //                                        @NonNull int[] grantResults) {
    //     act.imageUtils.onRequestPermissionsResult(requestCode, permissions, grantResults);
    // }

    public static boolean isSupportSendSMS(){
        return true;
    }

    public static boolean isSupportOrientation(){
        return true;
    }

    public static void sendSMS(String phoneNumber, String message) {
        try {
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            // This ensures only SMS apps respond
            intent.setData(Uri.parse("smsto:"+phoneNumber));
            intent.putExtra("sms_body", message);
//        if (intent.resolveActivity(act.getPackageManager()) != null) {
//            act.startActivity(intent);
//        }
        
            act.startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(act.getApplicationContext(), "Thiết bị của bạn không cho phép tự gửi tin nhắn, hãy thử soạn tin nhắn thủ công.", Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }
        
    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
}
