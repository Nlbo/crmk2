<?php


namespace App\Services;


use App\Models\Button;
use App\Models\Channel;
use App\Models\Post;
use App\Models\TelegramBot;
use Illuminate\Support\Str;
use Spatie\Url\Url;
use Telegram\Bot\Exceptions\TelegramSDKException;

class PostMacros
{
    /**
     * @var Post
     */
    private Post $post;
    /**
     * @var Channel
     */
    private Channel $channel;


    /**
     * PostMacros constructor.
     * @param Post $post
     * @param Channel $channel
     */
    public function __construct(Post $post, Channel $channel)
    {
        $this->post = $post;
        $this->channel = $channel;
    }

    /**
     * @return Post
     * @throws TelegramSDKException
     */
    public function run(): Post
    {
        if ($this->post->body !== null) {
            $this->post->body = $this->replace($this->post->body);
        }

        $this->post->buttons->each(fn(Button $button) => $button->url = $this->replace($button->url));


        return $this->post;
    }

    /**
     * @param string $body
     * @return string
     * @throws TelegramSDKException
     */
    private function replace(string $body): string
    {
        if (Str::contains($body, Post::BOT_ID_MACROS)) {
            $body = $this->replaceBotId($body);
        }

        if (Str::contains($body, Post::BOT_NAME_MACROS)) {
            $body = $this->replaceBotName($body);
        }

        if (Str::contains($body, Post::LINK_MACROS)) {
            $body = $this->replaceExternalLink($body);
        }

        if (Str::contains($body, Post::DIRECT_MACROS)) {
            $body = $this->replaceDirectLink($body);
        }

        return $body;
    }

    /**
     * @param string $body
     * @return string
     * @throws TelegramSDKException
     */
    private function replaceBotId(string $body): string
    {
        /** @var TelegramBot $manager */
        $manager = $this->channel->managers->first();

        $bot = (new Bot($manager->token))->getMe();

        $count = Str::substrCount($body, Post::BOT_ID_MACROS);
        $replace = array_fill(0, $count, "$bot->id");

        return Str::replaceArray(Post::BOT_ID_MACROS, $replace, $body);
    }

    /**
     * @param string $body
     * @return string
     * @throws TelegramSDKException
     */
    private function replaceBotName(string $body): string
    {
        /** @var TelegramBot $manager */
        $manager = $this->channel->managers->first();

        $bot = (new Bot($manager->token))->getMe();

        $count = Str::substrCount($body, Post::BOT_NAME_MACROS);
        $replace = array_fill(0, $count, "$bot->username");

        return Str::replaceArray(Post::BOT_NAME_MACROS, $replace, $body);
    }

    private function replaceExternalLink(string $body): string
    {
        if ($this->channel->external_link !== null) {
            $url = Url::fromString($this->channel->external_link);

            $params = [];
            parse_str($url->getQuery(), $params);

            $params['post_id'] = $this->post->id;
            $params['timestamp'] = now()->timestamp;

            $url = (string)$url->withQuery(http_build_query($params));

            if (Str::contains($body, Post::LINK_MACROS)) {
                $count = Str::substrCount($body, Post::LINK_MACROS);
                $replace = array_fill(0, $count, "$url");
                $body = Str::replaceArray(Post::LINK_MACROS, $replace, $body);
            }
        } else {
            $count = Str::substrCount($body, Post::LINK_MACROS);
            $replace = array_fill(0, $count, "");
            $body = Str::replaceArray(Post::LINK_MACROS, $replace, $body);
        }

        return $body;
    }

    private function replaceDirectLink(string $body): string
    {
        $url = $this->channel->direct_link;

        $count = Str::substrCount($body, Post::DIRECT_MACROS);
        $replace = array_fill(0, $count, "$url");
        return Str::replaceArray(Post::DIRECT_MACROS, $replace, $body);
    }
}
