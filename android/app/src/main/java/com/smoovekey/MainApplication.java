package com.smoovekey;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.chirag.RNMail.RNMail;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.calendarevents.CalendarEventsPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.gettipsi.stripe.StripeReactPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FIRMessagingPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new RNMail(),
            new ReactNativeOneSignalPackage(),
            new ImageResizerPackage(),
            new CalendarEventsPackage(),
            new RNBackgroundGeolocation(),
            new StripeReactPackage(),
            new ReactNativePermissionsPackage(),
            new ImagePickerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
