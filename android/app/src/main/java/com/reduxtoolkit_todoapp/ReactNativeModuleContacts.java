package com.ReduxToolkit;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReactNativeModuleContacts extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactApplicationContext;

    ReactNativeModuleContacts(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "UpdateContact";
    }

    @ReactMethod
    public void editContact() {
        Intent intent = new Intent(reactApplicationContext, CustomModuleContact.class);
        getCurrentActivity().startActivity(intent);
    }
}
