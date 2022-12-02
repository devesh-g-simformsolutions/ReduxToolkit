package com.reduxtoolkit_todoapp;

import androidx.annotation.NonNull;

import com.ReduxToolkit.MainActivity;
import com.ReduxToolkit.ReactNativeFetchContactModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class CustomModuleFetchContact implements ReactPackage {


    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {

        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ReactNativeFetchContactModule(reactApplicationContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
